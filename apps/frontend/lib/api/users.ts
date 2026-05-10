
import { get, post, patch, del } from './client';
import { User, UserSkill, PaginatedResponse, Review, SkillType, SkillLevel } from './types';

export const usersApi = {
  me: () =>
    get<User & { skills: UserSkill[] }>('/users/me'),

  list: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return get<PaginatedResponse<User>>(`/users?${qs}`);
  },

  updateMe: (data: { firstName?: string; lastName?: string; city?: string; bio?: string; avatarUrl?: string }) =>
    patch<{ message: string; user: User }>('/users/me', data),

  publicProfile: (userId: string) =>
    get<User & {
      skills: UserSkill[];
      reviews: Review[];
      actionButton: 'propose_session' | 'write_message' | 'view_session' | 'none';
    }>(`/users/${userId}`),

  // Skills management
  addSkill: (data: { skillId: string; type: SkillType; level: SkillLevel }) =>
    post<{ message: string; skill: UserSkill }>('/users/me/skills', data),

  updateSkillLevel: (userSkillId: string, level: SkillLevel) =>
    patch<{ message: string; skill: UserSkill }>(`/users/me/skills/${userSkillId}`, { level }),

  removeSkill: (userSkillId: string) =>
    del<void>(`/users/me/skills/${userSkillId}`),
};
