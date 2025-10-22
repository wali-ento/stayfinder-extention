const BASE_URL = 'https://stayfinder.stayfi.com';
const API_VERSION = 'v1';

type Options = RequestInit & {
  params?: Record<string, string | number | boolean | string[]>;
  maxRetries?: number;
  retryDelay?: number;
};

function buildUrl(endpoint: string, params?: Options['params']) {
  const url = new URL(`${BASE_URL}/api/${API_VERSION}/${endpoint}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) {
        // Handle array parameters
        v.forEach((item) => {
          url.searchParams.append(`${k}[]`, String(item));
        });
      } else {
        url.searchParams.append(k, String(v));
      }
    }
  }

  return url.toString();
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetch<T = unknown>(endpoint: string, options?: Options): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const retryDelay = options?.retryDelay ?? 1000;
  let lastError: Error = new Error('Unknown error occurred');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const url = buildUrl(endpoint, options?.params);

      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50_000); // 50 second timeout

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options && 'headers' in options ? options.headers : {}),
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 422) {
          return data;
        }

        if (
          response.status >= 400 &&
          response.status < 500 &&
          ![408, 429].includes(response.status)
        ) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn(
            `Request timeout for ${endpoint} (attempt ${attempt + 1}/${maxRetries + 1})`,
          );
        } else if (error.message.includes('Failed to fetch')) {
          console.warn(
            `Network error fetching ${endpoint} (attempt ${attempt + 1}/${maxRetries + 1}):`,
            error.message,
          );
        } else if (
          error.message.includes('HTTP error: 4') &&
          !error.message.includes('HTTP error: 408') &&
          !error.message.includes('HTTP error: 429')
        ) {
          throw error;
        } else {
          console.warn(
            `API error fetching ${endpoint} (attempt ${attempt + 1}/${maxRetries + 1}):`,
            error.message,
          );
        }
      }
      const backoffDelay = retryDelay * Math.pow(2, attempt);
      await delay(backoffDelay);
    }
  }

  // Handle timeout and network errors
  if (lastError instanceof Error) {
    if (lastError.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    if (lastError.message.includes('Failed to fetch')) {
      throw new Error(
        `Network error: Unable to connect to the server. Please check your internet connection and try again.`,
      );
    }

    throw lastError;
  }

  throw new Error('An unexpected error occurred while fetching data.');
}
