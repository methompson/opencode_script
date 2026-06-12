import { stat } from 'node:fs/promises';

import chalk from 'chalk';

import { isRecord, isString } from '@metools/tcheck';

import { runOpenCode } from '@/commands/run_opencode';
import { isDockerDaemonRunning } from '@/utils/is_docker_running';
import { dockerNotRunningMenu } from '@/menus/docker_not_running_menu';
import { debugHandler } from '@/handlers/debug_handler';
import { lmStudioMenu } from '@/menus/lm_studio_menu';

export async function defaultHandler(arg: unknown, opt: unknown) {
  try {
    if (isRecord(opt) && opt.debug) {
      return await debugHandler();
    }

    if (isRecord(opt) && opt.model) {
      return await lmStudioMenu();
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
  } catch (e) {
    if (e instanceof Error && e.name === 'ExitPromptError') {
      console.log(chalk.yellow('Exiting...'));
      process.exit(0);
    }

    console.error(chalk.red(`An error occurred: ${(e as Error).message}`));
    process.exit(1);
  }
}
