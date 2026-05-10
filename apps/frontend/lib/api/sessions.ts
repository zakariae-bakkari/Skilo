
import { get, post, patch } from './client';
import { Session, Message, PaginatedResponse } from './types';

export const sessionsApi = {
  propose: (data: {
    recipientId: string;
    scheduledAt: string;
    duration: number;
    offeredSkillId: string;
    wantedSkillId: string;
    message?: string;
    meetingLink?: string;
  }) => post<Session>('/sessions', data),

  list: (params?: { tab?: 'upcoming' | 'past'; page?: number; limit?: number; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.tab) qs.set('tab', params.tab);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.status) qs.set('status', params.status);
    return get<PaginatedResponse<Session>>(`/sessions?${qs}`);
  },

  get: (sessionId: string) =>
    get<Session>(`/sessions/${sessionId}`),

  accept: (sessionId: string) =>
    patch<Session>(`/sessions/${sessionId}/accept`),

  decline: (sessionId: string, reason?: string) =>
    patch<Session>(`/sessions/${sessionId}/decline`, { reason }),

  cancel: (sessionId: string, reason?: string) =>
    patch<Session>(`/sessions/${sessionId}/cancel`, { reason }),

  confirm: (sessionId: string, didHappen: boolean) =>
    patch<Session>(`/sessions/${sessionId}/confirm`, { didHappen }),

  getMessages: (sessionId: string) =>
    get<Message[]>(`/sessions/${sessionId}/messages`),

  createMessage: (sessionId: string, data: { content?: string; imageUrl?: string; isMeetingLinkSuggestion?: boolean }) =>
    post<Message>(`/sessions/${sessionId}/messages`, data),
};
