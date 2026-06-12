import { select, input, search } from '@inquirer/prompts';
import chalk from 'chalk';

import { getProviderDetails } from '@/menus/get_provider_details';

import { getModels } from '@/api/get_models';
import { openModel } from '@/api/open_model';
import { unloadModel } from '@/api/unload_model';

import { OpenCodeConfig, ProviderDetails } from '@/types/opencode_config';
import { readOpenCodeConfiguration } from '@/utils/config_reader';
import { getURLRoot, normalizeURL } from '@/utils/url_handler';

export async function lmStudioMenu() {
  const result = await select({
    message: 'LM Studio Menu',
    choices: [
      { name: 'Load Models', value: 'load' },
      { name: 'Unload Models', value: 'unload' },
      { name: 'Quit', value: 'quit' },
    ],
  });

  const config = await readOpenCodeConfiguration();

  switch (result) {
    case 'load':
      await loadModelsMenu(config);
      break;
    case 'unload':
      await unloadModelsMenu(config);
      break;
    case 'quit':
      process.exit(0);
  }
}

function getProviderRootUrl(providerDetails: ProviderDetails): string {
  const urlStrRaw = providerDetails.options.baseURL;
  const urlStr = normalizeURL(urlStrRaw);
  const rootUrl = getURLRoot(urlStr);

  return rootUrl;
}

export async function unloadModelsMenu(config: OpenCodeConfig) {
  const providerDetails = await getProviderDetails(config);

  const url = getProviderRootUrl(providerDetails);
  const lmStudioData = await getModels(url);

  const loadedModels: { displayName: string; key: string }[] = [];

  lmStudioData.models.forEach((model) => {
    if (model.loaded_instances.length > 0) {
      loadedModels.push({
        key: model.key,
        displayName: model.display_name,
      });
    }
  });

  if (loadedModels.length === 0) {
    console.log(chalk.bgGreen('No models to unload. Quitting.'));
    return;
  }

  const choices = [
    { name: 'All Models', value: { displayName: '', key: 'all' } },
    ...loadedModels.map((lm) => ({ name: lm.displayName, value: lm })),
    { name: 'Quit', value: { displayName: '', key: 'quit' } },
  ];

  const choice = await select({
    message: 'Unload which model?',
    choices,
  });

  switch (choice.key) {
    case 'quit': {
      console.log(chalk.bgGreen('Quitting without unloading any models.'));
      return;
    }
    case 'all': {
      await Promise.all(loadedModels.map((lm) => unloadModel(url, lm.key)));
      console.log(chalk.bgGreen('All models have been unloaded'));
      return;
    }
    default: {
      await unloadModel(url, choice.key);
      console.log(
        chalk.bgGreen(`${choice.displayName} has been unloaded from LM Studio`),
      );
    }
  }
}

/**
 * Menu for opening models in LM Studio. Allows a user to select one
 * based on the opencode config file and specifies a context window size
 */
export async function loadModelsMenu(config: OpenCodeConfig) {
  const providerDetails = await getProviderDetails(config);

  const models = Object.keys(providerDetails.models);

  if (models.length === 0) {
    console.log(
      chalk.yellow(`No models found for provider: ${providerDetails.name}`),
    );
    return;
  }

  const selectedModelName = await search({
    message: 'Select a model:',
    source: async (input) => {
      const vals = input?.split(' ').map((s) => s.toLowerCase());

      const filtered = vals
        ? models.filter((m) => {
            const lcModel = m.toLowerCase();
            return vals.every((v) => lcModel.includes(v));
          })
        : models;

      return [
        { name: 'Quit', value: 'quit' },
        ...filtered.map((m) => ({ name: m, value: m })),
      ];
    },
  });

  if (selectedModelName === 'quit') {
    console.log(chalk.bgGreen('Quitting without loading a model.'));
    return;
  }

  // Step 3: Input Context Window Size
  const contextWindowInput = await input({
    message: 'Enter context window size:',
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
  const baseUrl = getProviderRootUrl(providerDetails);

  const url = `${baseUrl}/api/v1/models/load`;

  console.log(
    chalk.cyan(
      `\nLoading model "${selectedModelName}" from ${providerDetails.name}...`,
    ),
  );

  await openModel({
    url,
    modelName: selectedModelName,
    contextLength,
  });

  console.log(chalk.greenBright('\n✅ Model loaded successfully!'));
}
