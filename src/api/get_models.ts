import {
  isGetModelsResponse,
  type GetModelsResponse,
} from '@/types/lm_get_models';

export async function getModels(baseUrl: string): Promise<GetModelsResponse> {
  const response = await fetch(`${baseUrl}/api/v1/models`);

  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }

  const data = await response.json();

  if (!isGetModelsResponse(data)) {
    throw new Error('Invalid response format from models API');
  }

  return data;
}
