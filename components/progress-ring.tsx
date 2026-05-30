import { cn } from '@/lib/utils';

export function ProgressRing({ value, label, className }: { value: number; label?: string; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('relative grid place-items-center', className)}>
      <div
        className="grid h-28 w-28 place-items-center rounded-full shadow-inner"
        style={{ background: `conic-gradient(#22c55e ${clamped * 3.6}deg, #e2e8f0 0deg)` }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
          <div className="text-center">
            <div className="text-2xl font-black">{clamped}%</div>
            {label ? <div className="text-[10px] font-bold uppercase text-muted-foreground">{label}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
