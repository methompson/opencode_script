import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';

import { readOpenCodeConfiguration } from '@/utils/config_reader';
import { openModel } from '@/api/open_model';

/**
 * Menu for opening models in LM Studio. Allows a user to select one
 * based on the opencode config file and specifies a context window size
 */
export async function lmStudioMenu() {
  try {
    const config = await readOpenCodeConfiguration();
    const providers = Object.keys(config.provider);

    if (providers.length === 0) {
      console.log(chalk.yellow('No providers found in configuration.'));
      return;
    }

    console.log(chalk.blueBright('LM Studio Model Loader\n'));

    // Step 1: Select Provider
    const selectedProviderName = await select({
      message: 'Select a provider:',
      choices: providers.map((p) => ({ name: p, value: p })),
    });

    const providerDetails = config.provider[selectedProviderName];

    if (!providerDetails) {
      throw new Error(
        `Provider details not found for: ${selectedProviderName}`,
      );
    }

    const models = Object.keys(providerDetails.models);

    if (models.length === 0) {
      console.log(
        chalk.yellow(`No models found for provider: ${selectedProviderName}`),
      );
      return;
    }

    // Step 2: Select Model
    const selectedModelName = await select({
      message: 'Select a model:',
      choices: models.map((m) => ({ name: m, value: m })),
    });

    // Step 3: Input Context Window Size
    const contextWindowInput = await input({
      message: 'Enter context window size (e.g., 16384):',
      default: '24576',
      validate: (value) => {
        const num = parseInt(value, 10);
        return !isNaN(num) && num > 0
          ? true
          : 'Please enter a valid positive number';
      },
    });

    const contextLength = parseInt(contextWindowInput, 10);

    // Step 4: Execute Model Loading
    // We need the base URL for the provider. In our config structure,
    // we don't have a direct 'baseUrl' in ProviderDetails, but let's assume
    // it's part of the provider configuration or derived from the provider name/npm.
    // Looking at src/types/opencode_config.ts: ProviderDetails has npm, name, options (baseURL).
    let baseUrl = providerDetails.options.baseURL;
    if (baseUrl.includes('host.docker.internal')) {
      baseUrl = baseUrl.replace('host.docker.internal', 'localhost');
    }
    // Base URL is an OpenAI endpoint. We're removing the v1
    // route to get the correct LM Studio endpoint.
    baseUrl = baseUrl.replace('/v1', '');

    console.log({ baseUrl });
    const url = `${baseUrl}/api/v1/models/load`;

    console.log(
      chalk.cyan(
        `\nLoading model "${selectedModelName}" from ${selectedProviderName}...`,
      ),
    );

    await openModel({
      url,
      modelName: selectedModelName,
      contextLength,
    });

    console.log(chalk.greenBright('\n✅ Model loaded successfully!'));
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`,
      ),
    );
  }
}
