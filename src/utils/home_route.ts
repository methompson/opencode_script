import { runCommandAndGetOutput } from '@/utils/cmd_runner';

export async function getHomeRoute(): Promise<string> {
  const output = await runCommandAndGetOutput('echo ~');
  return output;
}
