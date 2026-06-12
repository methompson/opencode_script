export async function unloadModel(
  baseUrl: string,
  modelKey: string,
): Promise<void> {
  const url = `${baseUrl}/api/v1/models/unload`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instance_id: modelKey,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to unload model: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
}
