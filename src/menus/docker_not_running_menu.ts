import { select } from '@inquirer/prompts';
import { wait } from '@metools/utils';
import chalk from 'chalk';

import { isDockerDaemonRunning } from '@/utils/is_docker_running';
import { openDocker } from '@/commands/open_docker';

export async function dockerNotRunningMenu() {
  console.log(chalk.bgRedBright('Docker is not running'), '\n');

  console.log(chalk.greenBright('Main Menu'));

  const result = await select({
    message: 'What do you want to do?',
    choices: [
      {
        name: 'Open Docker',
        value: 'open_docker',
      },
      {
        name: 'Exit',
        value: 'exit',
      },
    ],
  });

  switch (result) {
    case 'open_docker': {
      await openDocker();
      await waitForDockerToStart();
      break;
    }
    case 'exit':
    default: {
      console.log(chalk.bgGreenBright('Goodbye!'));
      process.exit(0);
    }
  }
}

async function waitForDockerToStart() {
  const startTime = Date.now();

  // Check if Docker is running every second for 30 seconds
  while (Date.now() - startTime < 30000) {
    const isOpen = await isDockerDaemonRunning();
    if (isOpen) {
      return;
    }

    await wait(1000);
  }

  throw new Error('Docker did not start within 30 seconds');
}
