import chalk from 'chalk';

import { runCommand } from '@/utils/cmd_runner';
import { getContainerName } from '@/utils/constants';

export async function deleteDockerImage() {
  await runCommand(`docker image rm ${getContainerName()}`).catch((error) => {
    const msg = error.message ?? `${error}`;
    if (msg.includes('No such image')) {
      console.warn(
        chalk.bgYellowBright(
          `⚠️ Docker image "${getContainerName()}" does not exist. Nothing to delete.`,
        ),
      );
      process.exit(0);
    }

    console.error(
      chalk.bgRedBright(
        `❌ Failed to delete Docker image "${getContainerName()}". It may not exist or there was an error: ${error.message}`,
      ),
    );
    process.exit(1);
  });

  console.log(
    chalk.bgYellowBright(
      `⚠️ Docker image "${getContainerName()}" deleted successfully!`,
    ),
  );
}
