'use client';

export function StepIndicator({ currentStep, total }: { currentStep: number; total: number }) {
  const labels = ['Skills you offer', 'Skills you want', 'Your profile'];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {labels.map((label, index) => {
        const step    = index + 1;
        const isActive = step === currentStep;
        const isDone   = step < currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                isActive ? 'bg-primary text-primary-foreground'
                : isDone  ? 'bg-primary/20 text-primary'
                           : 'bg-muted text-muted-foreground'
              }`}>
                {isDone ? '✓' : step}
              </div>
              <span className={`text-xs hidden sm:block ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {index < labels.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 mb-4 transition-colors ${isDone ? 'bg-primary/40' : 'bg-muted'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
