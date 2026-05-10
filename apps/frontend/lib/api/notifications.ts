
import { get, patch } from './client';
import { Notification, PaginatedResponse } from './types';

export const notificationsApi = {
  list: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return get<PaginatedResponse<Notification>>(`/notifications?${qs}`);
  },

  markRead: (notificationId: string) =>
    patch<void>(`/notifications/${notificationId}/read`),

  markAllRead: () =>
    patch<void>('/notifications/read-all'),
};
