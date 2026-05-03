'use client';

import { Session } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, MoreVertical, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function SessionList({ sessions }: { sessions: Session[] }) {
  const { user: authUser } = useAuth();
  
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
      {sessions.map((session) => {
        const isInitiator = session.proposedBy.id === authUser?.id;
        const otherUser = isInitiator ? session.recipient : session.proposedBy;
        const isPending = session.status === 'pending';
        const isConfirmed = session.status === 'confirmed';
        
        return (
          <Card key={session.id} className={`overflow-hidden transition-all hover:shadow-md border-l-4 ${
            isPending ? 'border-l-amber-400' : isConfirmed ? 'border-l-primary' : 'border-l-slate-300'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-[9px] font-bold uppercase tracking-widest h-5 px-2 ${
                        isPending 
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                          : isConfirmed 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {session.status === 'pending' ? 'En attente' : session.status === 'confirmed' ? 'Confirmé' : session.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(session.scheduledAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                      {otherUser.avatarUrl ? (
                        <img src={otherUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-bold text-sm tracking-tight">
                      Session avec {otherUser.firstName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                       <Video className={`w-3.5 h-3.5 ${session.meetingLink ? 'text-indigo-500' : 'text-slate-300'}`} /> 
                       {session.meetingLink ? 'Lien disponible' : 'Lien à venir'}
                     </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              
              <div className="mt-4 flex gap-2">
                {isConfirmed ? (
                  <>
                    <Button 
                      size="sm" 
                      className="h-9 flex-1 text-xs font-bold rounded-xl shadow-sm bg-primary hover:bg-primary/90"
                      onClick={() => session.meetingLink && window.open(session.meetingLink, '_blank')}
                      disabled={!session.meetingLink}
                    >
                      Rejoindre la classe
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 flex-1 text-xs font-bold rounded-xl border-slate-200">
                      Reporter
                    </Button>
                  </>
                ) : (
                  <>
                    {!isInitiator ? (
                      <Button size="sm" className="h-9 flex-1 text-xs font-bold rounded-xl bg-primary">
                        Répondre
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="h-9 flex-1 text-xs font-bold rounded-xl border-slate-200 italic opacity-70 cursor-default">
                        En attente de réponse...
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-9 px-3 text-xs font-bold rounded-xl text-destructive hover:bg-destructive/5">
                      Annuler
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        onClick={() => window.location.href = '/sessions'}
      >
        Voir toutes mes sessions
        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
