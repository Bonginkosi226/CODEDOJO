import { runCode, RunnerUnavailableError } from '../controllers/executeController.js';

export const STATUS = {
  UNAVAILABLE: 'unavailable',
  CODE_ERROR: 'code_error',
  CHECKED: 'checked',
};

const normalizeOutput = (str) => (str || '').replace(/\r\n/g, '\n').trim();
const stripWhitespace = (str) => (str || '').replace(/[ \t]/g, '');

// Runs the student's code (once per distinct stdin a check asks for, so this
// can later support multi-input timed challenges) and grades it against `checks`.
export async function evaluateSubmission({ language, code, checks }) {
  const runsByStdin = new Map();

  const getRun = async (stdin) => {
    const key = stdin || '';
    if (!runsByStdin.has(key)) {
      runsByStdin.set(key, await runCode({ language, code, stdin: key }));
    }
    return runsByStdin.get(key);
  };

  // Always run once with the default (empty) stdin first, even for lessons that only
  // have code_contains checks, so a compile/runtime error is always caught up front.
  const baselineStdin = (checks.find((c) => c.type !== 'code_contains' && c.stdin) || {}).stdin || '';

  let baseline;
  try {
    baseline = await getRun(baselineStdin);
  } catch (err) {
    if (err instanceof RunnerUnavailableError) {
      return { status: STATUS.UNAVAILABLE };
    }
    throw err;
  }

  // Raw combined output of the baseline run, for the Output Console — same
  // format the free-run /api/execute endpoint has always returned.
  const baselineOutput = baseline.stdout + (baseline.stderr ? '\n' + baseline.stderr : '');

  if (baseline.exitCode !== 0) {
    return {
      status: STATUS.CODE_ERROR,
      error: normalizeOutput(baseline.stderr || baseline.stdout),
      output: baselineOutput,
    };
  }

  const results = [];
  for (const check of checks) {
    let passed = false;

    if (check.type === 'code_contains') {
      passed = stripWhitespace(code).includes(stripWhitespace(check.value));
    } else {
      let run;
      try {
        run = await getRun(check.stdin || '');
      } catch (err) {
        if (err instanceof RunnerUnavailableError) {
          return { status: STATUS.UNAVAILABLE };
        }
        throw err;
      }

      if (run.exitCode !== 0) {
        passed = false;
      } else {
        let actual = normalizeOutput(run.stdout);
        let expected = normalizeOutput(check.value);
        if (check.ignoreCase) {
          actual = actual.toLowerCase();
          expected = expected.toLowerCase();
        }

        if (check.type === 'output_equals') {
          passed = actual === expected;
        } else if (check.type === 'output_contains') {
          passed = actual.includes(expected);
        }
      }
    }

    results.push({ passed, hint: passed ? null : check.hint });
  }

  return {
    status: STATUS.CHECKED,
    passed: results.every((r) => r.passed),
    results,
    output: baselineOutput,
  };
}
