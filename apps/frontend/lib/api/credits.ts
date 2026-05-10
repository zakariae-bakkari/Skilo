
import { get } from './client';
import { CreditBalance, CreditTransaction, PaginatedResponse, CreditType } from './types';

export const creditsApi = {
  balance: () =>
    get<CreditBalance>('/credits/balance'),

  history: (params?: { type?: CreditType; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return get<PaginatedResponse<CreditTransaction>>(`/credits/history?${qs}`);
  },
};
