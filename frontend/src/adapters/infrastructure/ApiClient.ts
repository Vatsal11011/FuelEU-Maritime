import type { IApiClient } from '../../core/ports/outbound/IApiClient';

export class ApiClient implements IApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText.substring(0, 100)}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but received ${contentType}. Response: ${text.substring(0, 200)}`);
    }
    
    return await response.json();
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText.substring(0, 100)}`);
    }
    
    const contentType = response.headers.get('content-type');
    // POST requests might return empty body (204 No Content) or JSON
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // If no content or non-JSON, return empty object as T
    if (response.status === 204 || response.status === 201) {
      return {} as T;
    }
    
    const text = await response.text();
    if (text) {
      throw new Error(`Expected JSON but received ${contentType}. Response: ${text.substring(0, 200)}`);
    }
    
    return {} as T;
  }

  async put<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}


