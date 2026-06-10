import { runCommand } from '@/utils/cmd_runner';

export async function openDocker() {
  const command = 'open -g -a Docker';
  await runCommand(command);
}
