'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { sessionsApi, Session } from '@/lib/api';
import { MessageCircle, Search, Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const { user: authUser } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    // Fetch upcoming sessions to act as active chats
    const fetchChats = async () => {
      try {
        const res = await sessionsApi.list({ tab: 'upcoming', limit: 50 });
        if (isMounted) setSessions(res.data);
      } catch (err) {
        console.error('Failed to fetch chats', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChats();

    return () => { isMounted = false; };
  }, []);

  if (!authUser) return null;

  const filteredSessions = sessions.filter(session => {
    const isInitiator = session.proposedBy.id === authUser.id;
    const otherUser = isInitiator ? session.recipient : session.proposedBy;
    const fullName = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold">Messagerie</h1>
        <p className="text-muted-foreground text-sm mt-1">Discutez avec vos partenaires de session.</p>
      </div>

      <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full h-10 bg-background border border-border rounded-xl pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="font-semibold text-lg mb-1">Aucune conversation</p>
            <p className="text-muted-foreground text-sm max-w-sm">
              Vous n'avez pas de sessions actives pour le moment. Proposez ou acceptez une session pour commencer à discuter !
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredSessions.map(session => {
              const isInitiator = session.proposedBy.id === authUser.id;
              const otherUser = isInitiator ? session.recipient : session.proposedBy;
              
              return (
                <Link
                  key={session.id}
                  href={`/messages/${session.id}`}
                  className="flex items-center gap-4 p-4 sm:p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                    {otherUser.avatarUrl ? (
                      <img src={otherUser.avatarUrl} alt={otherUser.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {otherUser.firstName[0]}{otherUser.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold truncate text-foreground">
                        {otherUser.firstName} {otherUser.lastName}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary/10 text-secondary-foreground uppercase tracking-widest shrink-0 ml-2">
                        {session.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      Session prévue le {new Date(session.scheduledAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
