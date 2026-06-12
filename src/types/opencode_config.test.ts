import { describe, it, expect } from 'vitest';
import { isOpenCodeConfig } from './opencode_config';

describe('isOpenCodeConfig', () => {
  it('should return true for a valid config', () => {
    const validConfig = {
      $schema: 'https://example.com/schema.json',
      provider: {
        openai: {
          npm: '@openai/sdk',
          name: 'OpenAI',
          options: {
            baseURL: 'https://api.openai.com/v1',
          },
          models: {
            'gpt-4': { name: 'GPT-4' },
          },
        },
      },
      model: 'gpt-4',
      small_model: 'gpt-3.5-turbo',
    };
    expect(isOpenCodeConfig(validConfig)).toBe(true);
  });

  it('should return true for a config with optional fields as undefined or null', () => {
    const validConfig = {
      $schema: 'https://example.com/schema.json',
      provider: {
        openai: {
          npm: '@openai/sdk',
          name: 'OpenAI',
          options: {
            baseURL: 'https://api.openai.com/v1',
          },
          models: {},
        },
      },
      model: undefined,
      small_model: null,
    };
    expect(isOpenCodeConfig(validConfig)).toBe(true);
  });

  it('should return false if $schema is not a string', () => {
    const invalidConfig = {
      $schema: 123,
      provider: {},
    };
    expect(isOpenCodeConfig(invalidConfig)).toBe(false);
  });

  it('should return false if provider is not an object of generator', () => {
    const invalidConfig = {
      $schema: 'https://example.com/schema.json',
      provider: 'not-an-object',
    };
    expect(isOpenCodeConfig(invalidConfig)).toBe(false);
  });

  it('should return false if provider details are incorrect', () => {
    const invalidConfig = {
      $schema: 'https://example.com/schema.json',
      provider: {
        openai: {
          npm: '@openai/sdk',
          name: 'OpenAI',
          options: {
            // baseURL is missing
          },
          models: {},
        },
      },
    };
    expect(isOpenCodeConfig(invalidConfig)).toBe(false);
  });

  it('should return false if provider models are incorrect', () => {
    const invalidConfig = {
      $schema: 'https://example.com/schema.json',
      provider: {
        openai: {
          npm: '@openai/sdk',
          name: 'OpenAI',
          options: {
            baseURL: 'https://api.openai.com/v1',
          },
          models: {
            'gpt-4': { name: 123 }, // name should be string
          },
        },
      },
    };
    expect(isOpenCodeConfig(invalidConfig)).toBe(false);
  });

  it('should return false if model is not a string or null/undefined', () => {
    const invalidConfig = {
      $schema: 'https://example.com/schema.json',
      provider: {},
      model: 123,
    };
    expect(isOpenCodeConfig(invalidConfig)).toBe(false);
  });
});
