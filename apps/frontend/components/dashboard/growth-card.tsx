import { Zap } from 'lucide-react';

interface GrowthCardProps {
  profileScore?: number;
}

export function GrowthCard({ profileScore = 0 }: GrowthCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden group">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest relative z-10">
        <Zap className="w-3 h-3" /> Next Level
      </div>
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between items-end mb-1">
          <span className="text-sm font-bold">Croissance</span>
          <span className="text-xs font-bold text-primary">{profileScore}%</span>
        </div>
        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${profileScore}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed pt-2">
          Complétez 2 sessions de plus pour atteindre le <span className="font-bold text-foreground">Niveau 2</span> et débloquer de nouveaux avantages !
        </p>
      </div>
    </div>
  );
}
