'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { onboardingApi } from '@/lib/api';
import type { SkillCatalogItem, SkillLevel, User } from '@/lib/api';
import { FormError } from '@/components/auth/form-error';
import { useAuth } from '@/contexts/auth-context';

// Import split components
import { StepIndicator } from './steps/step-indicator';
import { SkillSelectorStep, SelectedSkill } from './steps/skill-selector-step';
import { ProfileDetailsStep } from './steps/profile-details-step';
import { CongratsStep } from './steps/congrats-step';

const MAX_SKILLS = 5;

export function OnboardingForm() {
  const [step, setStep] = useState(1);

  const [offeredSkills, setOfferedSkills] = useState<SelectedSkill[]>([]);
  const [wantedSkills,  setWantedSkills]  = useState<SelectedSkill[]>([]);
  const [city,      setCity]      = useState('');
  const [bio,       setBio]       = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [finalUser,    setFinalUser]    = useState<User | null>(null);

  const { user, setOnboarded, updateUser } = useAuth();
  const router = useRouter();

  // ── Skill helpers ───────────────────────────────────────────────────────────

  function toggleSkill(skill: SkillCatalogItem, list: SelectedSkill[], setList: React.Dispatch<React.SetStateAction<SelectedSkill[]>>) {
    const exists = list.find((s) => s.skillId === skill.id);
    if (exists) {
      setList(list.filter((s) => s.skillId !== skill.id));
    } else {
      if (list.length >= MAX_SKILLS) return;
      setList([...list, { skillId: skill.id, name: skill.name, level: 'beginner' }]);
    }
  }

  function changeLevel(skillId: string, level: SkillLevel, setList: React.Dispatch<React.SetStateAction<SelectedSkill[]>>) {
    setList((prev) => prev.map((s) => (s.skillId === skillId ? { ...s, level } : s)));
  }

  function removeSkill(skillId: string, setList: React.Dispatch<React.SetStateAction<SelectedSkill[]>>) {
    setList((prev) => prev.filter((s) => s.skillId !== skillId));
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateStep(): string | null {
    if (step === 1 && offeredSkills.length === 0) return 'Select at least one skill you can teach.';
    if (step === 2 && wantedSkills.length === 0)  return 'Select at least one skill you want to learn.';
    return null;
  }

  function handleNext() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => s + 1);
  }

  // ── Submit to backend ────────────────────────────────────────────────────────

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await onboardingApi.complete({
        skillsOffered: offeredSkills.map((s) => ({ skillId: s.skillId, level: s.level })),
        skillsWanted:  wantedSkills.map((s)  => ({ skillId: s.skillId, level: s.level })),
        city:      city.trim()      || undefined,
        bio:       bio.trim()       || undefined,
        avatarUrl: avatarUrl        || undefined,
      });

      setFinalUser({
        ...user,
        ...result.user,
      });
      
      // Sync with global auth state
      updateUser(result.user);

      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const offeredIds = offeredSkills.map((s) => s.skillId);
  const wantedIds  = wantedSkills.map((s)  => s.skillId);

  // Congrats Step
  if (step === 4) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <CongratsStep
            user={finalUser}
            offeredSkills={offeredSkills}
            wantedSkills={wantedSkills}
            onGoToDashboard={() => { 
              setOnboarded(); 
              router.push('/dashboard'); 
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <StepIndicator currentStep={step} total={3} />

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        {step === 1 && (
          <SkillSelectorStep
            title="What can you teach?"
            subtitle="Select skills you're comfortable sharing. Up to 5."
            selectedSkills={offeredSkills}
            onToggle={(skill) => toggleSkill(skill, offeredSkills, setOfferedSkills)}
            onLevelChange={(id, level) => changeLevel(id, level, setOfferedSkills)}
            onRemove={(id) => removeSkill(id, setOfferedSkills)}
            disabledSkillIds={wantedIds}
          />
        )}

        {step === 2 && (
          <SkillSelectorStep
            title="What do you want to learn?"
            subtitle="Select skills you'd like to pick up from others. Up to 5."
            selectedSkills={wantedSkills}
            onToggle={(skill) => toggleSkill(skill, wantedSkills, setWantedSkills)}
            onLevelChange={(id, level) => changeLevel(id, level, setWantedSkills)}
            onRemove={(id) => removeSkill(id, setWantedSkills)}
            disabledSkillIds={offeredIds}
          />
        )}

        {step === 3 && (
          <ProfileDetailsStep
            city={city}
            bio={bio}
            avatarUrl={avatarUrl}
            onCityChange={setCity}
            onBioChange={setBio}
            onAvatarUrl={setAvatarUrl}
          />
        )}

        <FormError message={error} />

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button type="button" variant="outline" className="flex-1"
              onClick={() => { setError(null); setStep((s) => s - 1); }}
              disabled={isSubmitting}>
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button type="button" className="flex-1" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Setting up your profile…' : 'Complete setup'}
            </Button>
          )}
        </div>

        {step === 3 && (
          <p className="text-center text-xs text-muted-foreground">
            Everything on this step is optional — you can update it anytime from your profile.
          </p>
        )}
      </div>
    </div>
  );
}