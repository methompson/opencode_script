import { select } from '@inquirer/prompts';
import chalk from 'chalk';

import { OpenCodeConfig, ProviderDetails } from '@/types/opencode_config';

export async function getProviderDetails(
  config: OpenCodeConfig,
): Promise<ProviderDetails> {
  const providers = Object.keys(config.provider);

  if (providers.length === 0) {
    console.log(chalk.yellow('No providers found in configuration.'));
    process.exit(0);
  }

  console.log(chalk.blueBright('LM Studio Model Loader\n'));

  const providerOptions = [
    ...providers.map((p) => ({ name: p, value: p })),
    { name: 'Quit', value: 'quit' },
  ];

  // Step 1: Select Provider
  const selectedProviderName = await select({
    message: 'Select a provider:',
    choices: providerOptions,
  });

  const providerDetails = config.provider[selectedProviderName];

  if (!providerDetails) {
    throw new Error(`Provider details not found for: ${selectedProviderName}`);
  }

  return providerDetails;
}
