import { ApiError } from '@/services/errors';

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

/**
 * Small fetch wrapper for a future internal API.
 * Mock mode never constructs this client.
 */
export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number,
  ) {}

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body });
  }

  private async request<T>(path: string, options: RequestOptions): Promise<T> {
    if (!this.baseUrl) {
      throw new ApiError(
        'API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL, or switch DATA_SOURCE back to mock.',
      );
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          Accept: 'application/json',
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ApiError(`The request failed (${response.status}). The demo can continue in mock mode.`, response.status);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('The request timed out. Switch back to mock mode if you are presenting.');
      }
      throw new ApiError('The API could not be reached. Switch back to mock mode if you are presenting.');
    } finally {
      clearTimeout(timer);
    }
  }
}
