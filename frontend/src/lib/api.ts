/**
 * Centralized API fetch client for ReportIQ Frontend
 * Automatically manages:
 * 1. Base URL fallback (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')
 * 2. Bearer token injection
 * 3. 401 Unauthorized session expiration handling & redirect
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiFetchOptions extends RequestInit {
  isClientPortal?: boolean;
}

export async function apiFetch(endpoint: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { isClientPortal = false, headers = {}, ...rest } = options;

  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const tokenKey = isClientPortal ? 'riq_client_token' : 'riq_token';
  const token = typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token && !reqHeaders['Authorization']) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers: reqHeaders,
    ...rest,
  });

  // Handle Token Expiration / Unauthorized
  if (response.status === 401 && typeof window !== 'undefined') {
    if (isClientPortal) {
      localStorage.removeItem('riq_client_token');
      localStorage.removeItem('riq_client_user');
      if (!window.location.pathname.startsWith('/portal/login')) {
        window.location.href = '/portal/login?expired=true';
      }
    } else {
      localStorage.removeItem('riq_token');
      localStorage.removeItem('riq_user');
      if (!window.location.pathname.startsWith('/auth/login')) {
        window.location.href = '/auth/login?expired=true';
      }
    }
  }

  return response;
}
