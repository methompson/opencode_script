interface OpenModelInput {
  url: string;
  modelName: string;
  contextLength: number;
}

export async function openModel(args: OpenModelInput): Promise<void> {
  const response = await fetch(args.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: args.modelName,
      context_length: args.contextLength,
      flash_attention: true,
      echo_load_config: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to load model: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
}
