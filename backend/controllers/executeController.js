import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export const executeCode = async (req, res) => {
  const { language, version, files } = req.body;

  if (!files || files.length === 0 || !files[0].content) {
    return res.status(400).json({ success: false, message: "No code provided" });
  }

  const code = files[0].content;
  const requestId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), `codedojo_exec_${requestId}`);

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    let command = '';
    
    if (language === 'python') {
      const filePath = path.join(tempDir, 'script.py');
      fs.writeFileSync(filePath, code);
      command = `python3 ${filePath}`;
    } else if (language === 'java') {
      // Find class name to name the file correctly
      const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
      let className = 'Main';
      if (classMatch && classMatch[1]) {
        className = classMatch[1];
      }
      
      const filePath = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(filePath, code);
      command = `cd ${tempDir} && javac ${className}.java && java ${className}`;
    } else {
      return res.status(400).json({ success: false, message: "Unsupported language" });
    }

    try {
      const { stdout, stderr } = await execPromise(command, { timeout: 10000 });
      // Mimic piston response layout
      res.status(200).json({
        run: {
          output: stdout + (stderr ? "\n" + stderr : ""),
          stdout,
          stderr,
          code: 0
        }
      });
    } catch (execError) {
      res.status(200).json({
        run: {
          output: execError.stdout + (execError.stderr ? "\n" + execError.stderr : execError.message),
          stdout: execError.stdout,
          stderr: execError.stderr,
          code: execError.code
        }
      });
    }
  } catch (err) {
    console.error("Execution error:", err);
    res.status(500).json({ success: false, message: "Server execution error" });
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.error("Failed to clean up temp dir:", e);
    }
  }
};
