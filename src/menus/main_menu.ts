import { resolve } from 'node:path';

import { select } from '@inquirer/prompts';
import chalk from 'chalk';

export async function mainMenu(directory: string): Promise<void> {
  try {
    console.clear();
    const resolvedDir = resolve(directory);
    console.log(chalk.blue(`📁 File Renamer - ${resolvedDir}\n`));

    // Get list of files
    const originalFileList = await getFileList(resolvedDir);

    if (originalFileList.length === 0) {
      console.log(chalk.yellow('⚠️  No files found in directory.\n'));
      return;
    }

    // Build operations array
    const operations: FileOp[] = [];

    let addMore = true;
    while (addMore) {
      console.clear();

      showFileListPreview(originalFileList, operations);

      const currentFileList = FileOp.applyAllToFiles(
        originalFileList,
        operations,
      );

      const choices = [
        { name: 'Insert Text', value: 'insert' },
        { name: 'Replace Text', value: 'replace' },
        { name: 'Trim text', value: 'trim' },
        { name: 'Trim Between', value: 'trim-between' },
        { name: 'Letter Case', value: 'case' },
        { name: 'Add Counter', value: 'counter' },
        { name: 'List Operations', value: 'list-ops' },
        { name: 'Apply', value: 'apply' },
        { name: 'Quit', value: 'quit' },
      ];

      const operationType = await select({
        message: 'Select an operation:',
        choices,
        pageSize: choices.length,
      });

      switch (operationType) {
        case 'insert': {
          const op = await configureInsertOps(currentFileList);
          if (op) {
            operations.push(op);
          }
          break;
        }
        case 'replace': {
          const op = await configureReplaceOp(currentFileList);
          if (op) {
            operations.push(op);
          }
          break;
        }
        case 'trim': {
          const result = await configureTrimOps(currentFileList);
          if (result) {
            operations.push(result);
          }

          break;
        }
        case 'trim-between': {
          const result = await configureTrimBetweenOp(currentFileList);
          if (result) {
            operations.push(result);
          }

          break;
        }
        case 'case': {
          const op = await configureCaseOp(currentFileList);
          if (op) {
            operations.push(op);
          }
          break;
        }
        case 'counter': {
          const result = await configureCounterOp(currentFileList);
          if (result) {
            operations.push(result);
          }
          break;
        }
        case 'list-ops': {
          console.log('List');
          break;
        }
        case 'apply': {
          addMore = false;
          break;
        }
        case 'quit': {
          console.log(chalk.yellow('Exiting.\n'));
          return;
        }
        default: {
          break;
        }
      }
    }

    if (operations.length === 0) {
      console.log(chalk.yellow('No operations selected. Exiting.\n'));
      return;
    }

    await executeRename(resolvedDir, originalFileList, operations);
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`,
      ),
    );
    process.exit(1);
  }
}
