import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function ScreenHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="px-5 pb-4 pt-7 md:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-black uppercase tracking-[0.22em] text-green-600">{eyebrow}</p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-muted-foreground">{subtitle}</p>
        </div>
        {action ?? (
          <Button size="icon" className="shrink-0 rounded-full bg-yellow-400 text-slate-950">
            <Sparkles className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
