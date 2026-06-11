import path from 'node:path';

import { getHomeRoute } from '@/utils/home_route';
import { configFolderName } from '@/utils/constants';

export async function getFilesPath() {
  const homeRoute = await getHomeRoute();
  const filesPath = path.join(homeRoute, configFolderName(), 'local');

  return filesPath;
}

export async function getConfigPath() {
  const homeRoute = await getHomeRoute();
  const filesPath = path.join(homeRoute, configFolderName(), 'config');

  return filesPath;
}
