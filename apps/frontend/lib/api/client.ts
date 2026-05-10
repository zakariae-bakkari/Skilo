
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken() {
  return _accessToken;
}

export async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false,
): Promise<T> {
  const headers: Record<string, string> = {};

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }
  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body
      ? isFormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined,
  });

  if (res.status === 401 && path !== '/auth/refresh' && path !== '/auth/login') {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(method, path, body, isFormData);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('skilo:session-expired'));
    }
    throw new Error('Session expirée, veuillez vous reconnecter.');
  }

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const err = await res.json();
      message = err?.message ?? message;
    } catch { /* empty */ }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const json = await res.json();

    if (json?.access_token) {
      const { access_token, user } = json;
      _accessToken = access_token;

      if (typeof document !== 'undefined') {
        const onboardedStr = String(user.isOnboarded ?? false);
        const userStr = encodeURIComponent(JSON.stringify(user));

        document.cookie = `access_token=${access_token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `onboarded=${onboardedStr}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `user=${userStr}; path=/; max-age=604800; SameSite=Lax`;
      }

      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export const get = <T>(path: string) => request<T>('GET', path);
export const post = <T>(path: string, body?: unknown) => request<T>('POST', path, body);
export const patch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, body);
export const del = <T>(path: string) => request<T>('DELETE', path);
