
import { get, post } from './client';
import { User, SkillLevel } from './types';

export const onboardingApi = {
  complete: (data: {
    skillsOffered: { skillId: string; level: SkillLevel }[];
    skillsWanted: { skillId: string; level: SkillLevel }[];
    city?: string;
    bio?: string;
    avatarUrl?: string;
  }) => post<{ user: User }>('/onboarding', data),

  status: () =>
    get<{ isOnboarded: boolean }>('/onboarding/status'),
};
