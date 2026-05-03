'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Coins, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function AvatarMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen]  = useState(false);
  const router           = useRouter();
  const ref              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden hover:border-primary/40 transition-colors"
        aria-label="Account menu"
      >
        {user?.avatarUrl && user.avatarUrl.trim().length > 0 ? (
          <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-bold text-primary">{initials || '?'}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-52 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight opacity-70">{user?.email}</p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors font-medium"
            >
              <User className="w-4 h-4 text-muted-foreground" /> Mon profil
            </Link>
            <Link
              href="/credits"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors font-medium"
            >
              <Coins className="w-4 h-4 text-muted-foreground" /> Mes crédits
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors font-bold"
            >
              <LogOut className="w-4 h-4" /> Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
