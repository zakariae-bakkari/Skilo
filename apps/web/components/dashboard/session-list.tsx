'use client';

import { Session } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, MoreVertical } from 'lucide-react';

export function SessionList({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <Card className="border-dashed bg-muted/10">
        <CardContent className="pt-6 text-center">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
          <p className="text-sm text-muted-foreground">No sessions scheduled yet.</p>
          <Button variant="link" size="sm" className="mt-1 text-primary">Schedule your first swap</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Your Sessions</h3>
      {sessions.map((session) => (
        <Card key={session.id} className="overflow-hidden border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] h-5 px-1 bg-primary/5 text-primary border-primary/10">
                    {session.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(session.scheduledAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-bold text-sm">Session with {session.recipientId === 'current-user-id' ? 'Mentor' : 'Learner'}</p>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                     <Video className="w-3 h-3 text-indigo-500" /> Jitsi Meetup
                   </div>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="h-8 flex-1 text-xs">Join Class</Button>
              <Button size="sm" variant="outline" className="h-8 flex-1 text-xs">Reschedule</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
