import { ShieldCheck } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div>
      <ScreenHeader eyebrow="Welcome" title="Sign in to FitTrack" subtitle="Supabase Auth is wired for email magic links and can be extended to OAuth providers when the app expands beyond one user." />
      <section className="px-5 md:px-8">
        <Card>
          <ShieldCheck className="h-10 w-10 text-green-600" />
          <h2 className="mt-4 text-2xl font-black">Secure personal tracking</h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">Connect a Supabase project and configure environment variables to enable authenticated reads/writes.</p>
          <form className="mt-5 space-y-3">
            <input className="w-full rounded-2xl border px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-green-500" type="email" placeholder="you@example.com" />
            <Button className="w-full" type="button">Send magic link</Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
