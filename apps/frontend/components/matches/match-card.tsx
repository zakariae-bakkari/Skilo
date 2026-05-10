import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';
import type { Match } from '@/lib/api';
import { getCompatColor } from '@/app/(dashboard)/matches/utils';

interface MatchCardProps {
  match: Match;
  onPropose: (m: Match) => void;
  highlight?: boolean;
}

export function MatchCard({ match, onPropose, highlight }: MatchCardProps) {
  const router = useRouter();
  const u = match.otherUser;
  const initials = [u?.firstName?.[0] || '?', u?.lastName?.[0] || ''].join('').toUpperCase();
  const isPerfect = match.type === 'perfect';
  const compatColor = getCompatColor(match.score);

  return (
    <div 
      id={`match-${match.id}`}
      className={`bg-card border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group/card ${highlight ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md' : 'border-border'}`}
      onClick={() => router.push(`/matches/${match.id}`)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link 
          href={`/users/${u.id}`} 
          className="relative z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border-2 border-primary/20 hover:border-primary transition-colors">
            {u.avatarUrl
              ? <img src={u.avatarUrl} alt={u.firstName} className="w-full h-full object-cover" />
              : <span className="text-lg font-bold text-primary">{initials}</span>
            }
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link 
              href={`/users/${u.id}`}
              className="relative z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold hover:text-primary transition-colors">
                {u.firstName} {u.lastName}
              </h3>
            </Link>
            {u.hasBadgeFiable && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">🏅 Fiable</span>
            )}
            {isPerfect
              ? <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">⇄ Match parfait</span>
              : <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Match partiel</span>
            }
          </div>

          {u.city && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {u.city}</p>}

          {u.avgRating && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {Number(u.avgRating).toFixed(1)} · {u.sessionsCompleted} session{u.sessionsCompleted !== 1 ? 's' : ''}
            </p>
          )}

          {/* Matched pairs */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {match.matchedPairs.map((pair, i) => (
              <span key={i} className="text-xs bg-primary/8 text-primary px-2 py-1 rounded-lg border border-primary/10">
                {pair.offeredByA?.name ?? '?'} ⇄ {pair.offeredByB?.name ?? '?'}
              </span>
            ))}
          </div>

          {/* Partial match hint */}
          {!isPerfect && match.matchedPairs.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1.5 italic">
              Peut t'apprendre {match.matchedPairs[0].offeredByB?.name}. Propose-lui ce que tu sais faire !
            </p>
          )}
        </div>

        {/* Score + action */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className={`text-sm font-bold px-2.5 py-1 rounded-full border ${compatColor}`}>
            {match.score}%
          </span>
          <span className="text-xs text-muted-foreground">{match.label}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPropose(match);
            }}
            className={`mt-1 text-xs px-4 py-2 rounded-lg font-medium transition-all transform active:scale-95 ${
              isPerfect
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {isPerfect ? 'Proposer' : 'Écrire'}
          </button>
        </div>
      </div>
    </div>
  );
}
