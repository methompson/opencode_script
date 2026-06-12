import { describe, it, expect } from 'vitest';
import { isGetModelsResponse } from './lm_get_models';

describe('isGetModelsResponse', () => {
  it('should return true for a valid response', () => {
    const validResponse = {
      models: [
        {
          type: 'llama',
          publisher: 'meta',
          key: 'llama-3-8b',
          display_name: 'Llama 3 8B',
          architecture: 'llama',
          quantization: {
            name: 'q4_k_m',
            bits_per_weight: 4,
          },
          size_bytes: 5000000000,
          params_string: '8B',
          loaded_instances: [
            {
              id: 'inst-1',
              config: {
                context_length: 8192,
                eval_batch_size: 512,
                flash_attention: true,
                num_experts: undefined,
                offload_kv_cache_to_gpu: false,
              },
            },
          ],
          max_context_length: 8192,
          format: 'gguf',
          capabilities: {
            vision: false,
            trained_for_tool_use: true,
          },
          description: 'A great model',
        },
      ],
    };
    expect(isGetModelsResponse(validResponse)).toBe(true);
  });

  it('should return true for a response with optional fields as undefined or null', () => {
    const validResponse = {
      models: [
        {
          type: 'llama',
          publisher: 'meta',
          key: 'llama-3-8b',
          display_name: 'Llama 3 8B',
          architecture: undefined,
          quantization: null,
          size_bytes: 5000000000,
          params_string: null,
          loaded_instances: [],
          max_context_length: 8192,
          format: 'gguf',
          capabilities: undefined,
          description: null,
        },
      ],
    };
    expect(isGetModelsResponse(validResponse)).toBe(true);
  });

  it('should return false if models is not an array (object of generator)', () => {
    const invalidResponse = {
      models: {},
    };
    expect(isGetModelsResponse(invalidResponse)).toBe(false);
  });

  it('should return false if a required field is missing', () => {
    const invalidResponse = {
      models: [
        {
          type: 'llama',
          // publisher is missing
          key: 'llama-3-8b',
          display_name: 'Llama 3 8B',
          size_bytes: 5000000000,
          loaded_instances: [],
          max_context_length: 8192,
          format: 'gguf',
        },
      ],
    };
    expect(isGetModelsResponse(invalidResponse)).toBe(false);
  });

  it('should return false if a field has the wrong type', () => {
    const invalidResponse = {
      models: [
        {
          type: 'llama',
          publisher: 'meta',
          key: 'llama-3-8b',
          display_name: 'Llama 3 8B',
          size_bytes: 'not-a-number',
          loaded_instances: [],
          max_context_length: 8192,
          format: 'gguf',
        },
      ],
    };
    expect(isGetModelsResponse(invalidResponse)).toBe(false);
  });

  it('should return false if nested object structure is incorrect', () => {
    const invalidResponse = {
      models: [
        {
          type: 'llama',
          publisher: 'meta',
          key: 'llama-3-8b',
          display_name: 'Llama 3 8B',
          size_bytes: 5000000000,
          loaded_instances: [
            {
              id: 'inst-1',
              config: {
                context_length: 'not-a-number',
              },
            },
          ],
          max_context_length: 8192,
          format: 'gguf',
        },
      ],
    };
    expect(isGetModelsResponse(invalidResponse)).toBe(false);
  });
});
