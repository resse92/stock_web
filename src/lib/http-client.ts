import type { ApiResponse, ApiError, HttpClientConfig, RequestOptions } from '@/types/api';
import { config } from './config';

/**
 * Unified HTTP Client for API requests
 * Provides centralized error handling, request/response interceptors, and configuration
 */
class HttpClient {
  private config: HttpClientConfig;

  constructor(clientConfig?: Partial<HttpClientConfig>) {
    this.config = {
      baseURL: config.apiBaseUrl,
      timeout: config.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...clientConfig,
    };
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(url);
    const requestOptions = this.buildRequestOptions(method, data, options);

    try {
      const response = await fetch(fullUrl, requestOptions);
      
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const result = await response.json();
      return this.formatSuccessResponse<T>(result);
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * GET request
   */
  public async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  /**
   * POST request
   */
  public async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, options);
  }

  /**
   * PUT request
   */
  public async put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, options);
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  /**
   * Build full URL
   */
  private buildUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    const baseUrl = this.config.baseURL.endsWith('/') 
      ? this.config.baseURL.slice(0, -1) 
      : this.config.baseURL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
  }

  /**
   * Build request options
   */
  private buildRequestOptions(
    method: string,
    data?: unknown,
    options?: RequestOptions
  ): RequestInit {
    const headers = {
      ...this.config.headers,
      ...options?.headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: options?.signal,
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = JSON.stringify(data);
    }

    return requestOptions;
  }

  /**
   * Format success response
   */
  private formatSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle error response
   */
  private async handleErrorResponse(response: Response): Promise<ApiError> {
    let errorData: unknown;
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const errorObj = errorData as Record<string, unknown>;
    
    return {
      message: (errorObj?.message as string) || `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
      code: errorObj?.code as string,
      details: errorData,
    };
  }

  /**
   * Handle request error
   */
  private handleRequestError(error: unknown): ApiError {
    const err = error as Error & { name?: string; status?: number };
    
    if (err.name === 'AbortError') {
      return {
        message: 'Request was cancelled',
        status: 0,
        code: 'REQUEST_CANCELLED',
      };
    }

    if (err.name === 'TypeError' && err.message?.includes('fetch')) {
      return {
        message: 'Network error or server is unavailable',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    }

    // If it's already an ApiError, return as is
    if (err.status !== undefined) {
      return err as ApiError;
    }

    return {
      message: err.message || 'An unexpected error occurred',
      status: 0,
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
export default httpClient;