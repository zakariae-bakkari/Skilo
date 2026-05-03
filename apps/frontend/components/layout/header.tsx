'use client';

import { CreditsPill } from './credits-pill';
import { NotificationsBell } from './notifications-bell';
import { AvatarMenu } from './avatar-menu';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 shrink-0 shadow-sm">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors border border-border/50"
        aria-label="Open menu"
      >
        <div className="flex flex-col gap-1 items-center justify-center w-5">
          <div className="w-full h-0.5 bg-foreground/70 rounded-full"></div>
          <div className="w-full h-0.5 bg-foreground/70 rounded-full"></div>
          <div className="w-full h-0.5 bg-foreground/70 rounded-full"></div>
        </div>
      </button>

      {/* Spacer on desktop */}
      <div className="hidden lg:block" />

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <CreditsPill />
        <NotificationsBell />
        <AvatarMenu />
      </div>
    </header>
  );
}
