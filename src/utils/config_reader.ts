import path from 'node:path';
import { readFile } from 'node:fs/promises';

import { getConfigPath } from '@/utils/get_paths';
import { isOpencodeConfig, type OpencodeConfig } from '@/types/opencode_config';

export async function readOpenCodeConfiguration(): Promise<OpencodeConfig> {
  const configPath = await getConfigPath();
  const configFilePath = path.join(configPath, 'opencode', 'opencode.jsonc');

  const content = await readFile(configFilePath, 'utf-8');
  const config = JSON.parse(content);

  if (!isOpencodeConfig(config)) {
    throw new Error(`Invalid configuration file at ${configFilePath}`);
  }

  return config;
}
