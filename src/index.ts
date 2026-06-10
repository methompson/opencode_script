#!/usr/bin/env node

import { Command } from 'commander';

import { defaultHandler } from './handlers/default_handler';

main();
async function main() {
  const program = new Command();

  program
    .name('file-renamer')
    .description('CLI tool for batch renaming files')
    .version('1.0.0');

  program
    .argument('[directory]', 'Directory to run the Opencode script in')
    .option(
      '-d, --debug',
      'Debug Mode Menu. Perform operations on local files and docker images',
    )
    .option(
      '-m, --model',
      'Model Loader Menu. Choose an LLM to load with expanded context',
    )
    .action(defaultHandler);

  program.parse();
}
