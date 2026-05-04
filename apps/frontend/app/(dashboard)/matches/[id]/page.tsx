'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { matchesApi, Match, User } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { 
  ArrowLeft, Sparkles, MapPin, Star, Monitor, 
  Globe, Palette, Briefcase, Trophy, ChefHat, 
  MessageSquare, Calendar, ChevronRight, Zap, Target
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ProposeSessionModal } from '@/components/matches/propose-modal';

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, any> = {
  tech: Monitor,
  languages: Globe,
  arts: Palette,
  business: Briefcase,
  sport: Trophy,
  cooking: ChefHat,
  other: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  tech: 'bg-blue-100 text-blue-700',
  languages: 'bg-emerald-100 text-emerald-700',
  arts: 'bg-pink-100 text-pink-700',
  business: 'bg-amber-100 text-amber-700',
  sport: 'bg-indigo-100 text-indigo-700',
  cooking: 'bg-orange-100 text-orange-700',
  other: 'bg-purple-100 text-purple-700',
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: authUser } = useAuth();

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    matchesApi.get(id)
      .then(setMatch)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-96 bg-muted rounded-[3rem]" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-xl font-bold">Match introuvable</h1>
        <p className="text-muted-foreground">{error || "Ce match n'existe pas."}</p>
        <button onClick={() => router.back()} className="text-primary font-medium hover:underline">
          Retour aux opportunités
        </button>
      </div>
    );
  }

  const u = match.otherUser;
  const initials = [u.firstName[0], u.lastName[0]].join('').toUpperCase();
  const isPerfect = match.type === 'perfect';

  const compatColor =
    match.score >= 70 ? 'text-green-600 bg-green-50 border-green-200'
    : match.score >= 50 ? 'text-blue-600 bg-blue-50 border-blue-200'
    : 'text-orange-600 bg-orange-50 border-orange-200';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Retour aux opportunités
        </button>
        <div className="flex items-center gap-2">
          <span className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${isPerfect ? 'bg-green-100 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'}`}>
            {isPerfect ? 'Match Parfait' : 'Match Partiel'}
          </span>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="relative bg-card border border-border rounded-[3rem] p-10 shadow-2xl overflow-hidden group">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Avatar & Score */}
          <div className="flex flex-col items-center gap-6 shrink-0 mx-auto lg:mx-0">
            <div className="relative">
              <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-primary/5 p-1">
                <div className="w-full h-full rounded-[2.2rem] bg-card overflow-hidden border-4 border-card">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">
                      {initials}
                    </div>
                  )}
                </div>
              </div>
              {/* Score Overlay */}
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-card border-4 border-background flex flex-col items-center justify-center shadow-xl ${compatColor}`}>
                <span className="text-xl font-black">{match.score}%</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">Score</span>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                {u.firstName} {u.lastName}
              </h1>
              {u.city && <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center mt-1"><MapPin className="w-4 h-4" /> {u.city}</p>}
            </div>

            <div className="flex items-center gap-4 py-2 px-6 bg-muted/30 rounded-2xl border border-border/50">
              {u.avgRating && (
                <div className="flex items-center gap-1.5 text-sm font-black text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" /> {Number(u.avgRating).toFixed(1)}
                </div>
              )}
              <div className="w-px h-4 bg-border" />
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {u.sessionsCompleted} Session{u.sessionsCompleted !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Right: Matches & Action */}
          <div className="flex-1 space-y-10 w-full">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Pourquoi ce match ?
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {match.matchedPairs.map((pair, i) => (
                  <div key={i} className="group/pair p-6 bg-muted/40 rounded-3xl border border-border/50 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Il vous propose</p>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary fill-primary" />
                          <p className="text-lg font-black text-foreground">{pair.offeredByB?.name}</p>
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover/pair:rotate-12 transition-transform">
                        <ChevronRight className="w-6 h-6" />
                      </div>

                      <div className="flex-1 text-right space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vous lui donnez</p>
                        <p className="text-lg font-black text-foreground">{pair.offeredByA?.name || 'Session payante'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-[2] h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:opacity-90 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                Proposer une session
              </button>
              <Link 
                href={`/users/${u.id}`}
                className="flex-1 h-16 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-xs hover:bg-muted transition-all active:scale-[0.98] flex items-center justify-center"
              >
                Voir le profil complet
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Detail Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User B's Offered Skills */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Ses points forts
          </h3>
          <div className="space-y-3">
            {u.skills?.filter(s => s.type === 'offered').map((s: any, i: number) => {
              const Icon = CATEGORY_ICONS[s.skillCatalog.category] || Sparkles;
              return (
                <div key={s.id || `offered-${i}`} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[s.skillCatalog.category]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">{s.skillCatalog.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.level}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User B's Interests */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" /> Ce qu'il cherche
          </h3>
          <div className="space-y-3">
            {u.skills?.filter(s => s.type === 'wanted').map((s: any, i: number) => {
              const Icon = CATEGORY_ICONS[s.skillCatalog.category] || Sparkles;
              return (
                <div key={s.id || `wanted-${i}`} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[s.skillCatalog.category]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">{s.skillCatalog.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-red-500">{s.level}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ProposeSessionModal
        match={match}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          router.push('/sessions');
        }}
      />
    </div>
  );
}
