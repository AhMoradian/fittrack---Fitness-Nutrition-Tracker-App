import Link from 'next/link';
import Image from 'next/image';

export function FitTrackLogo() {
  return (
    <Link href="/" aria-label="FitTrack home" className="inline-flex shrink-0 items-center">
      <span className="relative block h-8 w-32 overflow-hidden" aria-hidden="true">
        <Image
          src="/fittrack-wordmark.png"
          alt=""
          width={144}
          height={144}
          className="absolute left-1/2 top-1/2 h-36 w-36 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>
    </Link>
  );
}

export function ScreenHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="px-5 pb-4 pt-7 md:px-8">
      <div className="mb-6 md:hidden">
        <FitTrackLogo />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-black uppercase tracking-[0.22em] text-green-600">{eyebrow}</p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-muted-foreground">{subtitle}</p>
        </div>
        {action}
      </div>
    </header>
  );
}
