import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InviteCardProps {
  onCopyInvite: () => void;
}

export function InviteCard({ onCopyInvite }: InviteCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-5 shadow-sm hover:border-primary/30 transition-colors relative group">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto rotate-3 group-hover:rotate-6 transition-transform">
        <Share2 className="w-7 h-7 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-sm">Inviter un ami</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Gagnez <span className="text-primary font-bold">5 crédits</span> pour chaque ami qui termine sa première session !
        </p>
      </div>
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full text-xs rounded-xl h-9"
        onClick={onCopyInvite}
      >
        Copier le lien d'invitation
      </Button>
    </div>
  );
}
