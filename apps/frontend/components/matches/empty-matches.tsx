import { Search } from 'lucide-react';
import Link from 'next/link';

interface EmptyMatchesProps {
  hasFilters: boolean;
}

export function EmptyMatches({ hasFilters }: EmptyMatchesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl shadow-sm">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <p className="font-semibold text-lg mb-1">Aucun match trouvé</p>
      <p className="text-muted-foreground text-sm mb-4 max-w-sm text-center">
        {hasFilters
          ? 'Essayez d\'élargir vos filtres pour voir plus de résultats.'
          : 'Enrichissez votre profil avec plus de compétences pour trouver des matchs compatibles !'
        }
      </p>
      <Link href="/profile" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-xl">
        Améliorer mon profil
      </Link>
    </div>
  );
}
