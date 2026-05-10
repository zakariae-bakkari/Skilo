import { Loader2 } from 'lucide-react';

export function DashboardLoader() {
  return (
    <div className="h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Chargement…</p>
      </div>
    </div>
  );
}
