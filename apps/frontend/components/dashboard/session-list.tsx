'use client';

import { Session } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, MoreVertical, User, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SessionList({ sessions }: { sessions: Session[] }) {
  const { user: authUser } = useAuth();
  const router = useRouter();
  
  if (sessions.length === 0) {
    return (
      <Card className="border-dashed bg-muted/10">
        <CardContent className="pt-6 text-center">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
          <p className="text-sm text-muted-foreground">Aucune session prévue pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.slice(0, 5).map((session) => {
        const isInitiator = session.proposedBy.id === authUser?.id;
        const otherUser = isInitiator ? session.recipient : session.proposedBy;
        const isPending = session.status === 'pending';
        const isConfirmed = session.status === 'confirmed';
        
        return (
          <Card 
            key={session.id} 
            className="overflow-hidden transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer border-border group"
            onClick={() => router.push(`/sessions/${session.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Link 
                    href={`/users/${otherUser.id}`} 
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 hover:border-primary transition-all">
                      {otherUser.avatarUrl ? (
                        <img src={otherUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-primary text-xs">{otherUser.firstName[0]}{otherUser.lastName[0]}</span>
                      )}
                    </div>
                  </Link>
                  <div className="min-w-0">
                    <Link 
                      href={`/users/${otherUser.id}`}
                      className="hover:text-primary transition-colors block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="font-bold text-sm tracking-tight truncate">
                        {otherUser.firstName} {otherUser.lastName}
                      </p>
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(session.scheduledAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(session.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`text-[8px] font-black uppercase tracking-widest h-5 px-2 ${
                      isPending 
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                        : isConfirmed 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {session.status === 'pending' ? 'En attente' : session.status === 'confirmed' ? 'Confirmé' : session.status}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group h-10"
        onClick={() => router.push('/sessions')}
      >
        Voir tout le planning
        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
