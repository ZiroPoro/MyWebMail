import { apiFetch, clearToken, readError, setToken } from './http';

export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  registeredAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  const data = (await response.json()) as AuthResponse;
  setToken(data.token);
  return data;
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  const data = (await response.json()) as AuthResponse;
  setToken(data.token);
  return data;
}

export async function fetchMe(): Promise<User> {
  const response = await apiFetch('/api/auth/me');
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<User>;
}

export async function logout(): Promise<void> {
  clearToken();
}

export async function fetchUsers(): Promise<User[]> {
  const response = await apiFetch('/api/admin/users');
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<User[]>;
}

export async function deleteUser(id: string): Promise<void> {
  const response = await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
