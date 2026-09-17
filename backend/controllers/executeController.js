import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);
const EXEC_TIMEOUT_MS = 10000;

export class RunnerUnavailableError extends Error {}

// Shared code runner used by the free "Run Code" endpoint below and by the
// mission checker service, so both grade against the exact same execution path.
export const runCode = async ({ language, code, stdin = '' }) => {
  if (language !== 'python' && language !== 'java') {
    throw new Error('Unsupported language');
  }

  const requestId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), `codedojo_exec_${requestId}`);

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    const stdinPath = path.join(tempDir, 'stdin.txt');
    fs.writeFileSync(stdinPath, stdin || '');

    let command = '';

    if (language === 'python') {
      const filePath = path.join(tempDir, 'script.py');
      fs.writeFileSync(filePath, code);
      command = `python3 "${filePath}" < "${stdinPath}"`;
    } else {
      // Find class name to name the file correctly
      const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
      const className = (classMatch && classMatch[1]) || 'Main';

      const filePath = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(filePath, code);
      command = `cd "${tempDir}" && javac ${className}.java && java ${className} < "${stdinPath}"`;
    }

    try {
      const { stdout, stderr } = await execPromise(command, { timeout: EXEC_TIMEOUT_MS });
      return { stdout, stderr, exitCode: 0 };
    } catch (execError) {
      // Timed out or the runner itself couldn't be spawned — not the student's fault.
      if (execError.killed || execError.signal || typeof execError.code !== 'number') {
        throw new RunnerUnavailableError('Code runner unavailable, please try again.');
      }
      return {
        stdout: execError.stdout || '',
        stderr: execError.stderr || execError.message || '',
        exitCode: execError.code,
      };
    }
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.error("Failed to clean up temp dir:", e);
    }
  }
};

export const executeCode = async (req, res) => {
  const { language, files } = req.body;

  if (!files || files.length === 0 || !files[0].content) {
    return res.status(400).json({ success: false, message: "No code provided" });
  }

  if (language !== 'python' && language !== 'java') {
    return res.status(400).json({ success: false, message: "Unsupported language" });
  }

  const code = files[0].content;

  try {
    const result = await runCode({ language, code });
    res.status(200).json({
      run: {
        output: result.stdout + (result.stderr ? "\n" + result.stderr : ""),
        stdout: result.stdout,
        stderr: result.stderr,
        code: result.exitCode
      }
    });
  } catch (err) {
    if (err instanceof RunnerUnavailableError) {
      return res.status(200).json({
        run: { output: err.message, stdout: '', stderr: '', code: null }
      });
    }
    console.error("Execution error:", err);
    res.status(500).json({ success: false, message: "Server execution error" });
  }
};
