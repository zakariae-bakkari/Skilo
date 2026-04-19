'use client';

import { useState, useEffect } from 'react';
import { usersApi, matchesApi, sessionsApi, User, Match, Session } from '@/lib/api';
import { ProfileSidebar } from '@/components/dashboard/profile-sidebar';
import { MatchList } from '@/components/dashboard/match-list';
import { SessionList } from '@/components/dashboard/session-list';
import { SiteHeader } from '@/components/site-header';
import { Loader2, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [meData, matchesResponse, sessionsResponse] = await Promise.all([
          usersApi.me(),
          matchesApi.list(),
          sessionsApi.list()
        ]);
        setUser(meData);
        setMatches(matchesResponse.data || []);
        setSessions(sessionsResponse.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Summary */}
          <aside className="lg:col-span-3 space-y-6">
            <ProfileSidebar user={user} />
            
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-3">
                <TrendingUp className="w-3 h-3" />
                Next Level
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Growth</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight mt-2">
                  Complete 2 more sessions to reach Level 2 and unlock new perks!
                </p>
              </div>
            </div>
          </aside>

          {/* Middle Column: Matches & Feed */}
          <section className="lg:col-span-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Bonjour, {user?.firstName}! 👋</h1>
                <p className="text-muted-foreground text-sm">Welcome back to your skill-sharing hub.</p>
              </div>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Propose Session
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Sparkles className="w-32 h-32" />
               </div>
               <MatchList matches={matches} />
            </div>
          </section>

          {/* Right Column: Sessions & Notifications */}
          <aside className="lg:col-span-3 space-y-8">
            <SessionList sessions={sessions} />
            
            <div className="rounded-xl border border-dashed p-4 text-center space-y-3 bg-muted/5">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                 <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">Invite a friend</h4>
              <p className="text-xs text-muted-foreground">Earn 5 credits for every friend who completes their first session!</p>
              <Button variant="outline" size="sm" className="w-full text-xs">Copy Invite Link</Button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
