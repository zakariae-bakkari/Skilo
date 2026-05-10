'use client';

import { useState, useEffect, useCallback } from 'react';
import { matchesApi } from '@/lib/api';
import type { Match, SkillCategory, MatchType } from '@/lib/api';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

import { ProposeSessionModal } from '@/components/matches/propose-modal';
import { MatchCard } from '@/components/matches/match-card';
import { MatchFilters } from '@/components/matches/match-filters';
import { EmptyMatches } from '@/components/matches/empty-matches';

export default function MatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = searchParams.get('id');

  const [matches,   setMatches]   = useState<Match[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [page,      setPage]      = useState(1);
  const [total,     setTotal]     = useState(0);

  // Modal state
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [typeFilter,     setTypeFilter]     = useState<MatchType | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | ''>('');
  const [sort,           setSort]           = useState<'score' | 'rating' | 'sessions'>('score');

  const LIMIT = 20;

  const fetchMatches = useCallback(() => {
    setLoading(true);
    matchesApi.list({
      type:     typeFilter     || undefined,
      category: categoryFilter || undefined,
      sort,
      page,
      limit: LIMIT,
    })
      .then((res) => {
        setMatches(res.data);
        setTotal(res.total);

        // Redirect to detail page if ID is provided
        if (targetId) {
          router.push(`/matches/${targetId}`);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [typeFilter, categoryFilter, sort, page, targetId, router]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [typeFilter, categoryFilter, sort]);

  // Handle "propose" from public profile
  useEffect(() => {
    const proposeId = searchParams.get('propose');
    if (proposeId) {
      matchesApi.byUser(proposeId)
        .then((m) => {
          setSelectedMatch(m);
          setIsModalOpen(true);
        })
        .catch(() => {});
    }
  }, [searchParams]);

  const handlePropose = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const perfectMatches  = matches.filter((m) => m.type === 'perfect');
  const partialMatches  = matches.filter((m) => m.type === 'partial');
  const totalPages      = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-10">

      <div>
        <h1 className="text-2xl font-bold">Mes matchs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {total > 0 ? `${total} utilisateur${total > 1 ? 's' : ''} compatible${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}` : 'Aucun match'}
        </p>
      </div>

      <MatchFilters 
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sort={sort}
        setSort={setSort}
      />

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive mb-2">{error}</p>
          <button onClick={fetchMatches} className="text-sm text-primary hover:underline">Réessayer</button>
        </div>
      ) : matches.length === 0 ? (
        <EmptyMatches hasFilters={!!(typeFilter || categoryFilter)} />
      ) : (
        <div className="space-y-6">
          {/* Perfect matches */}
          {perfectMatches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">⇄ Matchs parfaits</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{perfectMatches.length}</span>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {perfectMatches.map((m) => <MatchCard key={m.id} match={m} onPropose={handlePropose} highlight={m.id === targetId} />)}
              </div>
            </div>
          )}

          {/* Partial matches */}
          {partialMatches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Matchs partiels</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{partialMatches.length}</span>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {partialMatches.map((m) => <MatchCard key={m.id} match={m} onPropose={handlePropose} highlight={m.id === targetId} />)}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 pb-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-border disabled:opacity-40 hover:bg-muted transition-colors bg-card"
              >
                <ArrowLeft className="w-4 h-4" /> Précédent
              </button>
              <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-lg">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-border disabled:opacity-40 hover:bg-muted transition-colors bg-card"
              >
                Suivant <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Proposal Modal */}
      <ProposeSessionModal
        match={selectedMatch}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMatches}
      />
    </div>
  );
}
