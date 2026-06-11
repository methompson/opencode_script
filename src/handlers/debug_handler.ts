import { select } from '@inquirer/prompts';
import { rimraf } from 'rimraf';
import chalk from 'chalk';

import { buildDockerImage } from '@/commands/build_docker_image';
import { deleteDockerImage } from '@/commands/delete_docker_image';
import { getConfigPath, getFilesPath } from '@/utils/get_paths';

export async function debugHandler() {
  const choices = [
    { name: 'Clear local files', value: 'files' },
    { name: 'Clear local configuration', value: 'config' },
    { name: 'Clear all files', value: 'all' },
    { name: 'Build Docker Image', value: 'buildImage' },
    { name: 'Delete Docker Image', value: 'deleteImage' },
    { name: 'Quit', value: 'quit' },
  ];

  const operationType = await select({
    message: 'You are in debug mode:',
    choices,
    pageSize: choices.length,
  });

  console.log({ operationType });

  switch (operationType) {
    case 'files': {
      // Put a warning here?
      const filesPath = await getFilesPath();
      await rimraf(filesPath);

      console.log(chalk.yellow('Local files have been reset.'));
      break;
    }
    case 'config': {
      // Put a warning here?
      const configPath = await getConfigPath();
      await rimraf(configPath);

      console.log(chalk.yellow('Local configuration has been reset.'));
      break;
    }
    case 'all': {
      // Put a warning here?
      const [filesPath, configPath] = await Promise.all([
        getFilesPath(),
        getConfigPath(),
      ]);

      await Promise.all([rimraf(filesPath), rimraf(configPath)]);

      console.log(
        chalk.yellow('All local files and configuration have been reset.'),
      );
      break;
    }
    case 'buildImage': {
      await buildDockerImage();
      break;
    }
    case 'deleteImage': {
      await deleteDockerImage();
      break;
    }
    case 'quit':
      return;
    default:
      console.error(chalk.red('Invalid operation.'));
      break;
  }
}
