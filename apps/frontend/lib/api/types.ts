
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type SkillCategory = 'tech' | 'languages' | 'arts' | 'business' | 'sport' | 'cooking' | 'other';
export type SkillType = 'offered' | 'wanted';
export type MatchType = 'perfect' | 'partial';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'auto_completed' | 'cancelled' | 'disputed';
export type CreditType = 'welcome_bonus' | 'profile_bonus' | 'session_earned' | 'session_spent' | 'session_reserved' | 'session_released' | 'session_confirmed';

export interface User {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  city?: string;
  bio?: string;
  avatarUrl?: string;
  isOnboarded: boolean;
  isActive: boolean;
  creditBalance: number;
  creditReserved: number;
  profileScore: number;
  avgRating?: number;
  avgPedagogy?: number;
  avgPunctuality?: number;
  avgCommunication?: number;
  sessionsCompleted: number;
  hasBadgeFiable: boolean;
  createdAt: string;
}

export interface SkillCatalogItem {
  id: string;
  name: string;
  category: SkillCategory;
  status: 'approved' | 'pending_review';
  usageCount: number;
}

export interface SkillEntry {
  skillId: string;
  level: SkillLevel;
}

export interface UserSkill {
  id: string;
  skillCatalogId: string;
  type: SkillType;
  level: SkillLevel;
  skillCatalog: SkillCatalogItem;
}

export interface Match {
  id: string;
  score: number;
  type: MatchType;
  label: string;           // 'Très compatible' | 'Compatible' | 'Partiellement compatible'
  matchedPairs: MatchedPair[];
  status: 'active' | 'archived';
  // The other user
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    city?: string;
    avatarUrl?: string;
    avgRating?: number;
    sessionsCompleted: number;
    hasBadgeFiable: boolean;
    skills: UserSkill[];
  };
}

export interface MatchedPair {
  offeredByA: { id: string; name: string; level: SkillLevel };
  offeredByB: { id: string; name: string; level: SkillLevel };
}

export interface Session {
  id: string;
  status: SessionStatus;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  message?: string;
  skillsExchanged: { offeredSkillName: string; wantedSkillName: string }[];
  confirmedByA: boolean | null;
  confirmedByB: boolean | null;
  creditsUsed: number;
  createdAt: string;
  proposedBy: {
    id: string;
    firstName: string;
    lastName: string;
    city?: string;
    avatarUrl?: string;
    avgRating?: number;
    sessionsCompleted?: number;
  };
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
    city?: string;
    avatarUrl?: string;
    avgRating?: number;
    sessionsCompleted?: number;
  };
  reviews?: { reviewerId: string }[];
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  content?: string;
  imageUrl?: string;
  isMeetingLinkSuggestion: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  ratingPedagogy?: number;
  ratingPunctuality?: number;
  ratingCommunication?: number;
  comment?: string;
  isVisible: boolean;
  submittedAt: string;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  skillCatalog?: { name: string };
}

export interface CreditBalance {
  available: number;
  reserved: number;
  total: number;
  cap: number;   // always 20
  estimatedHours: number;
}

export interface CreditTransaction {
  id: string;
  type: CreditType;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  session?: { id: string };
}

export interface Notification {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
