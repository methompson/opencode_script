import { spawn } from 'node:child_process';

export async function runCommand(command: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      stdio: 'inherit',
    });

    child.on('error', (error) => {
      reject(error instanceof Error ? error : new Error(`${error}`));
    });

    child.on('close', (code, signal) => {
      if (signal) {
        reject(
          new Error(`Command "${command}" was terminated by signal ${signal}.`),
        );
        return;
      }

      if (code !== 0) {
        reject(new Error(`Command "${command}" exited with code ${code}.`));
        return;
      }

      resolve();
    });
  });
}

export async function runCommandAndGetOutput(command: string): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('error', (error) => {
      reject(error instanceof Error ? error : new Error(`${error}`));
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(
          new Error(
            `Command "${command}" failed with code ${code}: ${errorOutput.trim()}`,
          ),
        );
      }
    });
  });
}
