'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  Undo, 
  Inbox 
} from 'lucide-react';
import { notificationsApi } from '@/lib/api';
import type { Notification } from '@/lib/api';

const ICONS: Record<string, React.ReactNode> = {
  new_perfect_match:  <Award className="w-4 h-4 text-primary" />,
  match_upgraded:     <TrendingUp className="w-4 h-4 text-green-500" />,
  session_proposed:   <MessageSquare className="w-4 h-4 text-blue-500" />,
  session_accepted:   <CheckCircle className="w-4 h-4 text-green-500" />,
  session_declined:   <XCircle className="w-4 h-4 text-destructive" />,
  session_reminder:   <Clock className="w-4 h-4 text-amber-500" />,
  session_completed:  <CheckCircle className="w-4 h-4 text-green-500" />,
  review_received:    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />,
  badge_earned:       <Award className="w-4 h-4 text-purple-500" />,
  credits_earned:     <CoinsIcon className="w-4 h-4 text-amber-500" />,
  credits_refunded:   <Undo className="w-4 h-4 text-amber-500" />,
};

// Simple wrapper for Coins to avoid naming conflict with Lucide
function CoinsIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
}

const TYPE_LABELS: Record<string, string> = {
  new_perfect_match:  "Nouveau match parfait !",
  match_upgraded:     "Match amélioré",
  session_proposed:   "Session proposée",
  session_accepted:   "Session acceptée",
  session_declined:   "Session déclinée",
  session_reminder:   "Rappel de session",
  session_completed:  "Session terminée",
  review_received:    "Nouvel avis reçu",
  badge_earned:       "Nouveau badge obtenu",
  credits_earned:     "Crédits gagnés",
  credits_refunded:   "Crédits remboursés",
};

export function NotificationsBell() {
  const [open, setOpen]             = useState(false);
  const [items, setItems]           = useState<Notification[]>([]);
  const [unread, setUnread]         = useState(0);
  const ref                         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationsApi.list({ limit: 10 }).then((res) => {
      setItems(res.data);
      setUnread(res.data.filter((n) => !n.isRead).length);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function markAll() {
    await notificationsApi.markAllRead().catch(() => {});
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button onClick={markAll} className="text-xs text-primary hover:underline">
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune notification</p>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 text-sm ${n.isRead ? '' : 'bg-primary/5'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-background rounded-full border border-border">
                      {ICONS[n.type] ?? <Inbox className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`leading-snug ${n.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                        {String((n.payload as Record<string, unknown>)?.body ?? TYPE_LABELS[n.type] ?? n.type)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
