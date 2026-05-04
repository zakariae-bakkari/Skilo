'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  usersApi, reviewsApi,
  User, UserSkill, Review, MatchedPair,
} from '@/lib/api';
import { 
  MapPin, Star, Calendar, MessageSquare, ArrowLeft, 
  Zap, Target, Sparkles, Award, CheckCircle2,
  Monitor, Globe, Palette, Briefcase, Trophy, ChefHat, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<string, string> = {
  beginner:     'Débutant',
  intermediate: 'Intermédiaire',
  advanced:     'Avancé',
};

const LEVEL_COLORS: Record<string, string> = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced:     'bg-purple-100 text-purple-700',
};

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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} 
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Components ───────────────────────────────────────────────────────────────

function SkillCard({ skill }: { skill: UserSkill }) {
  const Icon = CATEGORY_ICONS[skill.skillCatalog.category] || Sparkles;
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/50 hover:bg-card transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[skill.skillCatalog.category]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground text-sm truncate">{skill.skillCatalog.name}</p>
        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${skill.type === 'offered' ? 'text-primary' : 'text-indigo-500'}`}>
          {LEVEL_LABELS[skill.level]}
        </p>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-6 border border-border/50 rounded-2xl bg-card/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
            {review.reviewer.avatarUrl ? (
              <img src={review.reviewer.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black text-primary">{review.reviewer.firstName[0]}{review.reviewer.lastName?.[0]}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{review.reviewer.firstName} {review.reviewer.lastName}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{formatDate(review.submittedAt)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Stars rating={review.rating} />
          {review.skillCatalog && (
            <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
              {review.skillCatalog.name}
            </span>
          )}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
      )}

      {(review.ratingPedagogy || review.ratingPunctuality || review.ratingCommunication) && (
        <div className="flex flex-wrap gap-4 pt-3 border-t border-border/30">
          {review.ratingPedagogy && (
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Pédagogie: <span className="text-foreground">{review.ratingPedagogy}/5</span></span>
            </div>
          )}
          {review.ratingCommunication && (
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Comm.: <span className="text-foreground">{review.ratingCommunication}/5</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type PublicUser = User & {
  skills: UserSkill[];
  actionButton: 'propose_session' | 'write_message' | 'view_session' | 'none';
  match?: { score: number; label: string; type: string; matchedPairs: MatchedPair[] } | null;
};

export default function PublicProfilePage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [user,    setUser]    = useState<PublicUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      usersApi.publicProfile(id),
      reviewsApi.forUser(id),
    ])
      .then(([userData, reviewData]) => {
        setUser(userData);
        setReviews(reviewData.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8 animate-pulse">
        <div className="h-8 w-32 bg-muted rounded-xl" />
        <div className="h-64 bg-muted rounded-[3rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-96 bg-muted rounded-3xl" />
          <div className="h-96 bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <Target className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2">Profil introuvable</h1>
          <p className="text-muted-foreground text-sm">{error || 'Ce profil n\'existe pas ou n\'est pas disponible.'}</p>
        </div>
        <button onClick={() => router.push('/dashboard')} className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20">
          Retour au Dashboard
        </button>
      </div>
    );
  }

  const offeredSkills = user.skills.filter((s) => s.type === 'offered');
  const wantedSkills  = user.skills.filter((s) => s.type === 'wanted');
  const initials      = [user.firstName[0], user.lastName[0]].join('').toUpperCase();

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20 space-y-8">

      {/* Back & Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Header & Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="relative bg-card border border-border rounded-[3rem] p-10 overflow-hidden shadow-2xl shadow-primary/5 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-primary/5 p-1 shrink-0">
                <div className="w-full h-full rounded-[2.2rem] bg-card overflow-hidden border-4 border-card shadow-inner">
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary">{initials}</div>
                  }
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                    <h1 className="text-3xl font-black tracking-tight">{user.firstName} {user.lastName}</h1>
                    {user.hasBadgeFiable && (
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200">
                        <Award className="w-3.5 h-3.5" /> Fiable
                      </div>
                    )}
                  </div>
                  {user.city && <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {user.city}</p>}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  {user.avgRating ? (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Évaluation</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black">{Number(user.avgRating).toFixed(1)}</span>
                        <Stars rating={Number(user.avgRating)} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</p>
                      <p className="text-sm font-bold text-muted-foreground">Nouveau membre</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sessions</p>
                    <p className="text-xl font-black">{user.sessionsCompleted}</p>
                  </div>

                  {user.match && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Compatibilité</p>
                      <div className={`px-3 py-1 rounded-xl border font-black text-xs ${
                        user.match.score >= 70 ? 'text-green-600 bg-green-50 border-green-200'
                        : user.match.score >= 50 ? 'text-blue-600 bg-blue-50 border-blue-200'
                        : 'text-orange-600 bg-orange-50 border-orange-200'
                      }`}>
                        {user.match.score}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user.bio && (
              <div className="relative z-10 mt-10 p-6 bg-muted/30 rounded-3xl border border-border/50">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 opacity-60">À propos</p>
                <p className="text-sm leading-relaxed text-muted-foreground italic">"{user.bio}"</p>
              </div>
            )}
          </div>

          {/* Detailed Matching Pairs */}
          {user.match && user.match.matchedPairs.length > 0 && (
            <div className="bg-card border border-border rounded-[3rem] p-10 space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight">Pourquoi cet échange est idéal ?</h2>
                <p className="text-sm text-muted-foreground">Voici comment vos compétences s'alignent parfaitement.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {user.match.matchedPairs.map((pair, i) => (
                  <div key={i} className="group p-6 bg-muted/40 rounded-3xl border border-border/50 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Il vous propose</p>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary fill-primary" />
                          <p className="text-lg font-black text-foreground">{pair.offeredByB?.name}</p>
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:rotate-12 transition-transform">
                        <ChevronRight className="w-6 h-6" />
                      </div>

                      <div className="flex-1 text-right space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">En échange de</p>
                        <p className="text-lg font-black text-foreground">{pair.offeredByA?.name || 'Session payante'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" /> Peut enseigner
              </h2>
              <div className="space-y-3">
                {offeredSkills.map((s) => <SkillCard key={s.id} skill={s} />)}
              </div>
            </section>

            <section className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" /> Cherche à apprendre
              </h2>
              <div className="space-y-3">
                {wantedSkills.map((s) => <SkillCard key={s.id} skill={s} />)}
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Actions & Reviews */}
        <div className="space-y-8">
          
          {/* Main Action Card */}
          <div className="bg-foreground text-background rounded-[3rem] p-10 space-y-8 shadow-2xl shadow-primary/20 sticky top-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight leading-tight">Envie d'échanger avec {user.firstName} ?</h3>
              <p className="text-sm opacity-60">Réservez une session dès maintenant.</p>
            </div>

            <div className="space-y-3">
              {user.actionButton === 'propose_session' && (
                <button 
                  onClick={() => router.push(`/matches?propose=${user.id}`)}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  Proposer une session
                </button>
              )}
              {user.actionButton === 'view_session' && (
                <button 
                  onClick={() => router.push('/sessions')}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Voir ma session
                </button>
              )}
              <button className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/10">
                <MessageSquare className="w-5 h-5" />
                Lui écrire
              </button>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Tarif match</p>
                  <p className="text-sm font-bold">{user.match?.score === 100 ? 'Gratuit (Réciprocité)' : '1 crédit / session'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Avis reçus <span className="text-muted-foreground font-medium ml-1">({reviews.length})</span>
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="p-10 text-center bg-card/40 border border-border/50 rounded-[2.5rem]">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground">Aucun avis pour l'instant.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            )}
          </section>

        </div>
      </div>

    </div>
  );
}
