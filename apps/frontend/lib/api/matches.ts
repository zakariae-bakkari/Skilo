
import { get, post } from './client';
import { Match, PaginatedResponse, MatchType, SkillCategory, SkillLevel } from './types';

export const matchesApi = {
  list: (params?: {
    type?: MatchType;
    category?: SkillCategory;
    level?: SkillLevel;
    sort?: 'score' | 'rating' | 'sessions';
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.category) qs.set('category', params.category);
    if (params?.level) qs.set('level', params.level);
    if (params?.sort) qs.set('sort', params.sort);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return get<PaginatedResponse<Match>>(`/matches?${qs}`);
  },

  get: (matchId: string) =>
    get<Match>(`/matches/${matchId}`),

  byUser: (userId: string) =>
    get<Match>(`/matches/user/${userId}`),

  recalculate: () =>
    post<void>('/matches/recalculate'),
};
