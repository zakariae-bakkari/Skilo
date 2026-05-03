'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Loader2 } from 'lucide-react';
import { reviewsApi, Session } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

export function ReviewDialog({ 
  session, 
  isOpen, 
  onClose,
  onSuccess
}: { 
  session: Session | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user: authUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [pedagogy, setPedagogy] = useState(0);
  const [hoverPedagogy, setHoverPedagogy] = useState(0);

  const [punctuality, setPunctuality] = useState(0);
  const [hoverPunctuality, setHoverPunctuality] = useState(0);

  const [communication, setCommunication] = useState(0);
  const [hoverCommunication, setHoverCommunication] = useState(0);

  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session || !authUser) return null;

  const isInitiator = session.proposedBy.id === authUser.id;
  const otherUser = isInitiator ? session.recipient : session.proposedBy;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Veuillez donner une note.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await reviewsApi.submit({
        sessionId: session.id,
        globalRating: rating,
        pedagogyRating: pedagogy > 0 ? pedagogy : undefined,
        punctualityRating: punctuality > 0 ? punctuality : undefined,
        communicationRating: communication > 0 ? communication : undefined,
        comment: comment.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="p-6 bg-primary/5 border-b border-border/50 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mx-auto mb-4 border-2 border-primary/20">
            {otherUser.avatarUrl ? (
              <img src={otherUser.avatarUrl} alt={otherUser.firstName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">
                {otherUser.firstName[0]}{otherUser.lastName[0]}
              </span>
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center">Évaluer {otherUser.firstName}</DialogTitle>
            <DialogDescription className="text-center mt-2 text-muted-foreground">
              Comment s'est passée votre session d'échange ?
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-2 pb-4 border-b border-border/50">
            <h3 className="text-sm font-bold text-foreground">Note globale *</h3>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-500 text-amber-500' 
                        : 'text-muted-foreground/30'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {rating === 0 ? 'Sélectionnez une note' : rating === 5 ? 'Excellent !' : rating === 4 ? 'Très bien' : rating === 3 ? 'Bien' : rating === 2 ? 'Moyen' : 'Médiocre'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Pedagogy */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pédagogie</span>
              <div className="flex gap-0.5" onMouseLeave={() => setHoverPedagogy(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverPedagogy(star)}
                    onClick={() => setPedagogy(star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star 
                      className={`w-4 h-4 transition-colors ${
                        (hoverPedagogy || pedagogy) >= star 
                          ? 'fill-amber-500/80 text-amber-500/80' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Punctuality */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ponctualité</span>
              <div className="flex gap-0.5" onMouseLeave={() => setHoverPunctuality(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverPunctuality(star)}
                    onClick={() => setPunctuality(star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star 
                      className={`w-4 h-4 transition-colors ${
                        (hoverPunctuality || punctuality) >= star 
                          ? 'fill-amber-500/80 text-amber-500/80' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Communication */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Communication</span>
              <div className="flex gap-0.5" onMouseLeave={() => setHoverCommunication(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverCommunication(star)}
                    onClick={() => setCommunication(star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star 
                      className={`w-4 h-4 transition-colors ${
                        (hoverCommunication || communication) >= star 
                          ? 'fill-amber-500/80 text-amber-500/80' 
                          : 'text-muted-foreground/30'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Commentaire (optionnel)</label>
            <textarea
              className="w-full min-h-[100px] bg-muted/30 border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Qu'avez-vous pensé de l'échange ?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
        </div>

        <DialogFooter className="p-6 bg-muted/10 border-t border-border/50">
          <Button variant="ghost" onClick={onClose} disabled={loading} className="rounded-xl">
            Plus tard
          </Button>
          <Button onClick={handleSubmit} disabled={loading || rating === 0} className="rounded-xl px-8 shadow-md">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
