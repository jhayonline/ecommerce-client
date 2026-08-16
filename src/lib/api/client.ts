import { API_BASE_URL, getAssetUrl } from './config';
import { ApiResponse } from './types';

export async function backendRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.description || 'Request failed');
  }

  const data = await response.json();

  return {
    success: true,
    data: data,
    message: 'Success'
  };
}

export const getImageUrl = getAssetUrl;
