import {
  isString,
  isObjectOfGenerator,
  typeGuardGenerator,
  TypeGuard,
  unionGuard,
  isUndefinedOrNull,
} from '@metools/tcheck';

interface ModelInfo {
  name: string;
}

interface ProviderOptions {
  baseURL: string;
}

export interface ProviderDetails {
  npm: string;
  name: string;
  options: ProviderOptions;
  models: Record<string, ModelInfo>;
}

export interface OpenCodeConfig {
  $schema: string;
  provider: Record<string, ProviderDetails>;
  model?: string;
  small_model?: string;
}

const isStringOruNdefinedOrNull = unionGuard<string | undefined | null>(
  isString,
  isUndefinedOrNull,
);

const isModelInfo = typeGuardGenerator<ModelInfo>({
  name: isString,
});

const isProviderOptions = typeGuardGenerator<ProviderOptions>({
  baseURL: isString,
});

const isProviderDetails = typeGuardGenerator<ProviderDetails>({
  npm: isString,
  name: isString,
  options: isProviderOptions,
  models: isObjectOfGenerator(isModelInfo),
});

export const isOpenCodeConfig: TypeGuard<OpenCodeConfig> = typeGuardGenerator({
  $schema: isString,
  provider: isObjectOfGenerator(isProviderDetails),
  model: isStringOruNdefinedOrNull,
  small_model: isStringOruNdefinedOrNull,
});
