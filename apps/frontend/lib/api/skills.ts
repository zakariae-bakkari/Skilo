
import { get, post } from './client';
import { SkillCatalogItem, PaginatedResponse, SkillCategory } from './types';

export const skillsApi = {
  search: (q?: string) =>
    get<SkillCatalogItem[]>(`/skills/search${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  findAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return get<PaginatedResponse<SkillCatalogItem>>(`/skills?${qs}`);
  },

  create: (data: { name: string; category: SkillCategory }) =>
    post<SkillCatalogItem>('/skills', data),
};
