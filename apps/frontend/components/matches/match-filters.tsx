import { SkillCategory, MatchType } from '@/lib/api';
import { CATEGORIES, SORT_OPTIONS } from '@/app/(dashboard)/matches/utils';

interface MatchFiltersProps {
  typeFilter: MatchType | '';
  setTypeFilter: (val: MatchType | '') => void;
  categoryFilter: SkillCategory | '';
  setCategoryFilter: (val: SkillCategory | '') => void;
  sort: 'score' | 'rating' | 'sessions';
  setSort: (val: 'score' | 'rating' | 'sessions') => void;
}

export function MatchFilters({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  sort,
  setSort
}: MatchFiltersProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* Type filter */}
        <button
          onClick={() => setTypeFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${typeFilter === '' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
        >
          Tous
        </button>
        <button
          onClick={() => setTypeFilter('perfect')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${typeFilter === 'perfect' ? 'bg-green-500 text-white border-green-500' : 'border-border hover:border-green-400'}`}
        >
          ⇄ Parfaits uniquement
        </button>
        <button
          onClick={() => setTypeFilter('partial')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${typeFilter === 'partial' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
        >
          Partiels uniquement
        </button>
      </div>

      {/* Category */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategoryFilter('')}
          className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${categoryFilter === '' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
        >
          Toutes catégories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategoryFilter(categoryFilter === c.value ? '' : c.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${categoryFilter === c.value ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground shrink-0">Trier par :</span>
        <div className="flex gap-1.5">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value as any)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${sort === s.value ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
