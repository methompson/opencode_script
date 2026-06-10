// import path from 'node:path';

import { runCommand } from '@/utils/cmd_runner';
import { configFolderName, getContainerName } from '@/utils/constants';

export async function runOpenCode(location: string) {
  // const storageLocation = path.join(process.cwd(), 'anythingllm_data');

  const command = `
    HOME_ROUTE=~

    docker run \
      --rm \
      -it \
      -v "$HOME_ROUTE/${configFolderName()}/local/share/opencode:/home/met/.local/share/opencode" \
      -v "$HOME_ROUTE/${configFolderName()}/config/opencode:/home/met/.config/opencode" \
      -v "${location}:/workspace" \
      -w /workspace \
      ${getContainerName()}`;

  await runCommand(command);
}
