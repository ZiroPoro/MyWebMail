const TOKEN_KEY = 'webmail-token';

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  try {
    return await fetch(input, { ...init, headers });
  } catch {
    throw new Error(
      'Failed to fetch: запустите Frontend (npm run dev) и Backend (mvn spring-boot:run). Открывайте http://localhost:5173',
    );
  }
}

function forbiddenHint(): string {
  return 'Forbidden (403): перезапустите Frontend (npm run dev). На 8080 должен быть MyWebMail, не Jenkins.';
}

export async function readError(response: Response): Promise<string> {
  if (response.status === 403) {
    return forbiddenHint();
  }
  try {
    const data = (await response.json()) as { message?: string; error?: string };
    if (data.message) {
      return data.message;
    }
    return data.error ?? response.statusText;
  } catch {
    if (response.status === 404) {
      return 'Сервер не нашёл API (404). Перезапустите Backend: mvn spring-boot:run';
    }
    return response.statusText || 'Ошибка запроса';
  }
}
