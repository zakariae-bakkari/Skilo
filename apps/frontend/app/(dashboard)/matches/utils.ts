import { SkillCategory, MatchType } from '@/lib/api';
import React from 'react';
import { Monitor, Globe, Palette, Briefcase, Trophy, ChefHat, Sparkles } from 'lucide-react';

export const CATEGORIES: { value: SkillCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'tech',      label: 'Tech',      icon: React.createElement(Monitor, { className: "w-3.5 h-3.5" }) },
  { value: 'languages', label: 'Langues',   icon: React.createElement(Globe, { className: "w-3.5 h-3.5" }) },
  { value: 'arts',      label: 'Arts',      icon: React.createElement(Palette, { className: "w-3.5 h-3.5" }) },
  { value: 'business',  label: 'Business',  icon: React.createElement(Briefcase, { className: "w-3.5 h-3.5" }) },
  { value: 'sport',     label: 'Sport',     icon: React.createElement(Trophy, { className: "w-3.5 h-3.5" }) },
  { value: 'cooking',   label: 'Cuisine',   icon: React.createElement(ChefHat, { className: "w-3.5 h-3.5" }) },
  { value: 'other',     label: 'Autre',     icon: React.createElement(Sparkles, { className: "w-3.5 h-3.5" }) },
];

export const SORT_OPTIONS = [
  { value: 'score',    label: 'Compatibilité' },
  { value: 'rating',   label: 'Note' },
  { value: 'sessions', label: 'Sessions' },
] as const;

export function getCompatColor(score: number) {
  if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 50) return 'text-blue-600 bg-blue-50 border-blue-200';
  return 'text-orange-600 bg-orange-50 border-orange-200';
}
