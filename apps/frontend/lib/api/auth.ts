
import { get, post } from './client';
import { User } from './types';

export const authApi = {
  register: ({ passwordConfirm, ...data }: { firstName: string; lastName: string; email: string; password: string; passwordConfirm?: string; referredById?: string }) =>
    post<{ access_token: string; user: User }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    post<{ access_token: string; user: User; redirectTo: string }>('/auth/login', data),

  logout: () =>
    post<void>('/auth/logout'),

  refresh: () =>
    post<{ access_token: string }>('/auth/refresh'),

  me: () =>
    get<User>('/auth/me'),
};
