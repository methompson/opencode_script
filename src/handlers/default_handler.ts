import { stat } from 'node:fs/promises';

import chalk from 'chalk';

import { isRecord, isString } from '@metools/tcheck';

import { runOpenCode } from '@/commands/run_opencode';
import { isDockerDaemonRunning } from '@/utils/is_docker_running';
import { dockerNotRunningMenu } from '@/menus/docker_not_running_menu';
import { debugHandler } from './debug_handler';
import { lmStudioMenu } from '@/menus/lm_studio_menu';

export async function defaultHandler(arg: unknown, opt: unknown) {
  console.log({ opt });
  if (isRecord(opt) && opt.debug) {
    return debugHandler();
  }

  if (isRecord(opt) && opt.model) {
    return lmStudioMenu();
  }

  const dir = isString(arg) ? arg : process.cwd();
  await stat(dir).catch(() => {
    console.log(chalk.red(`Error: "${dir}" is not a valid directory.`));
    process.exit(1);
  });

  const isDockerRunning = await isDockerDaemonRunning();

  // If Docker is not running, show the menu to start Docker or exit
  if (!isDockerRunning) {
    await dockerNotRunningMenu();
  }

  await runOpenCode(dir);
}
