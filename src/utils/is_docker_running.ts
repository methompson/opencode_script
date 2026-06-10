import { runCommandAndGetOutput } from './cmd_runner';
import { getContainerName } from './constants';

export async function isContainerRunning() {
  const command = `
    docker container ls \
      -f "name=${getContainerName()}" \
      -q \
      | wc -l`;

  const output = await runCommandAndGetOutput(command);
  return output === '1';
}

export async function isContainerAvailable() {
  const command = `
    docker ps \
      -a \
      -f "name=${getContainerName()}" \
      -q \
      | wc -l`;

  const output = await runCommandAndGetOutput(command);
  return output === '1';
}

export async function isDockerDaemonRunning() {
  const command = `
    docker info > /dev/null 2>&1 && echo "1" || echo "0"`;

  const output = await runCommandAndGetOutput(command);
  return output === '1';
}
