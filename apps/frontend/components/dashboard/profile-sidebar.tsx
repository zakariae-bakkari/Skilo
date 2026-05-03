'use client';

import type { User } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Award, CreditCard } from 'lucide-react';

export function ProfileSidebar({ user }: { user: User | null }) {
  if (!user) return null;

  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase();

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="mx-auto w-24 h-24 rounded-full border-2 border-primary/20 p-1 mb-4 flex items-center justify-center overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center font-bold text-2xl text-primary">
              {initials}
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
        <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
            <CreditCard className="w-3 h-3" /> {user.creditBalance} Credits
          </Badge>
        </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            <span className="truncate">{user.email}</span>
          </div>

        {user.bio && (
          <div className="mt-6 text-left border-t pt-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-wider opacity-60">Bio</p>
            <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-3">
              "{user.bio}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
