import {
  isString,
  typeGuardGenerator,
  TypeGuard,
  unionGuard,
  isUndefinedOrNull,
  isNumber,
  isBoolean,
  isArrayOfGenerator,
} from '@metools/tcheck';

export interface GetModelsResponse {
  models: Model[];
}

interface Model {
  type: string;
  publisher: string;
  key: string;
  display_name: string;
  architecture?: string;
  quantization?: Quantization;
  size_bytes: number;
  params_string: string | null;
  loaded_instances: LoadedInstance[];
  max_context_length: number;
  format: string;
  capabilities?: Capabilities;
  description: string | null;
}

interface Quantization {
  name: string;
  bits_per_weight: number;
}

interface LoadedInstance {
  id: string;
  config: InstanceConfig;
}

interface InstanceConfig {
  context_length: number;
  eval_batch_size?: number;
  flash_attention?: boolean;
  num_experts?: number;
  offload_kv_cache_to_gpu?: boolean;
}

interface Capabilities {
  vision: boolean;
  trained_for_tool_use: boolean;
}

const isStringOrUndefinedOrNull = unionGuard<string | undefined | null>(
  isString,
  isUndefinedOrNull,
);

const isQuantization = typeGuardGenerator<Quantization>({
  name: isString,
  bits_per_weight: isNumber,
});

const isNumberOrUndefinedOrNull = unionGuard<number | undefined | null>(
  isNumber,
  isUndefinedOrNull,
);

const isBooleanOrUndefinedOrNull = unionGuard<boolean | undefined | null>(
  isBoolean,
  isUndefinedOrNull,
);

const isInstanceConfig = typeGuardGenerator<InstanceConfig>({
  context_length: isNumber,
  eval_batch_size: isNumberOrUndefinedOrNull,
  flash_attention: isBooleanOrUndefinedOrNull,
  num_experts: isNumberOrUndefinedOrNull,
  offload_kv_cache_to_gpu: isBooleanOrUndefinedOrNull,
});

const isLoadedInstance = typeGuardGenerator<LoadedInstance>({
  id: isString,
  config: isInstanceConfig,
});

const isCapabilities = typeGuardGenerator<Capabilities>({
  vision: isBoolean,
  trained_for_tool_use: isBoolean,
});

const isModel = typeGuardGenerator<Model>({
  type: isString,
  publisher: isString,
  key: isString,
  display_name: isString,
  architecture: isStringOrUndefinedOrNull,
  quantization: unionGuard(isQuantization, isUndefinedOrNull),
  size_bytes: isNumber,
  params_string: isStringOrUndefinedOrNull,
  loaded_instances: isArrayOfGenerator(isLoadedInstance),
  max_context_length: isNumber,
  format: isString,
  capabilities: unionGuard(isCapabilities, isUndefinedOrNull),
  description: isStringOrUndefinedOrNull,
});

export const isGetModelsResponse: TypeGuard<GetModelsResponse> =
  typeGuardGenerator({
    models: isArrayOfGenerator(isModel),
  });
