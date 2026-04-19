'use client';

import { User } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { SelectedSkill } from './skill-selector-step';

export function CongratsStep({ user, offeredSkills, wantedSkills, onGoToDashboard }: {
  user: User | null;
  offeredSkills: SelectedSkill[];
  wantedSkills: SelectedSkill[];
  onGoToDashboard: () => void;
}) {
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase();

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="text-4xl">🎉</div>
        <h2 className="text-2xl font-bold">You're all set!</h2>
        <p className="text-muted-foreground text-sm">
          Here's how others will see your profile. Start exploring matches!
        </p>
      </div>

      <div className="bg-muted/30 border border-border rounded-xl p-5 text-left space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">{initials || '?'}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-base">
              {user?.firstName} {user?.lastName}
            </p>
            {user?.city && (
              <p className="text-sm text-muted-foreground">📍 {user.city}</p>
            )}
          </div>
        </div>

        {user?.bio && (
          <p className="text-sm text-muted-foreground border-t border-border pt-3">{user.bio}</p>
        )}

        <div className="border-t border-border pt-3 space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              🎓 Can teach
            </p>
            <div className="flex flex-wrap gap-1.5">
              {offeredSkills.map((s) => (
                <span key={s.skillId} className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {s.name} · {s.level}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              📚 Wants to learn
            </p>
            <div className="flex flex-wrap gap-1.5">
              {wantedSkills.map((s) => (
                <span key={s.skillId} className="px-2.5 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium">
                  {s.name} · {s.level}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-3 flex items-center gap-2">
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            🪙 2 welcome credits
          </span>
          <span className="text-xs text-muted-foreground">ready to spend</span>
        </div>
      </div>

      <Button className="w-full" onClick={onGoToDashboard}>
        Explore matches →
      </Button>
    </div>
  );
}
