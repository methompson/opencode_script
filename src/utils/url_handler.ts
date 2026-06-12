/**
 * Gets just the root of the URL without any path.
 */
export function getURLRoot(urlStr: string) {
  const url = new URL(urlStr);
  return url.origin;
}

/**
 * Converts a docker URL to a local URL. i.e. converts
 * host.docker.internal to localhost. This is necessary because the
 * application runs in a docker container and cannot access the host's
 * localhost URL.
 */
export function normalizeURL(url: string) {
  return url.replace('host.docker.internal', 'localhost');
}
