import path from 'node:path';
import { mkdir, open } from 'node:fs/promises';

import { rimraf } from 'rimraf';
import chalk from 'chalk';

import { runCommand } from '@/utils/cmd_runner';
import { getContainerName } from '@/utils/constants';

export async function buildDockerImage() {
  const tempDir = path.join('/tmp', 'opencode_docker_build');
  // Ensure the temp directory is clean
  await rimraf(tempDir);

  // Create the temp directory
  await mkdir(tempDir, { recursive: true });

  // Create the Dockerfile in the temp directory
  const dockerfilePath = path.join(tempDir, 'Dockerfile');
  const fileHandle = await open(dockerfilePath, 'w');
  await fileHandle.write(dockerFileContents);
  await fileHandle.close();

  // Build the Docker image using the Dockerfile in the temp directory
  await runCommand(`docker build -t ${getContainerName()} ${tempDir}`);

  // Clean up when we're done.
  await rimraf(tempDir);

  console.log(
    chalk.bgGreenBright(
      '✅ Docker image "opencode_docker" built successfully!',
    ),
  );
}

const dockerFileContents = `
FROM ubuntu:24.04

# Install basic development requirements
RUN apt-get update && apt-get install -y \
  curl \
  git \
  sudo \
  && rm -rf /var/lib/apt/lists/*

# Setup non-root user for security
RUN useradd -m -s /bin/bash met && \
  echo "met ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
USER met
WORKDIR /workspace

# Install the OpenCode binary into the user's home path
RUN curl -fsSL https://opencode.ai/install | bash

RUN mkdir -p /home/met/.local/share/opencode && \
  mkdir -p /home/met/.config/opencode
# Ensure the binary is available globally inside the container
ENV PATH="/home/met/.opencode/bin:\${PATH}"

ENTRYPOINT ["opencode"]
`;
