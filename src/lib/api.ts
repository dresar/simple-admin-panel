import { API_BASE_URL } from '@/config/api';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  token?: string | null;
  body?: BodyInit | object | null;
}

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, body, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    ...fetchOptions.headers,
  };

  // Only set Content-Type for non-FormData requests
  if (!(body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Token ${token}`;
  }

  let processedBody: BodyInit | undefined;
  if (body instanceof FormData) {
    processedBody = body;
  } else if (body && typeof body === 'object') {
    processedBody = JSON.stringify(body);
  } else if (body) {
    processedBody = body as BodyInit;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    body: processedBody,
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - trigger logout
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || errorData.detail || 'An error occurred';
    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return null as T;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text as T;
  }
}

// Helper for multipart uploads
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  token?: string | null
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: formData,
    token,
  });
}

export { ApiError };
