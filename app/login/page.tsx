'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cloud, Mail, ShieldCheck } from 'lucide-react';
import { ScreenHeader } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

const cloudConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const sendMagicLink = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!cloudConfigured) return;

    setSending(true);
    setMessage('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      });
      if (error) throw error;
      setMessage('Magic link sent. Open it on this device to finish signing in.');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Could not send the magic link.',
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <ScreenHeader
        eyebrow="Cloud sync"
        title="Connect your devices"
        subtitle="Use the same email on your phone and computer. Your FitTrack progress will stay in sync securely."
      />
      <section className="px-4 sm:px-5 md:px-8">
        <Card className="mx-auto max-w-xl">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-100 text-green-700">
              <Cloud className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-black">Private cloud backup</h2>
              <p className="text-sm font-bold text-muted-foreground">
                Protected by a password-free email link.
              </p>
            </div>
          </div>

          {cloudConfigured ? (
            <form onSubmit={sendMagicLink} className="mt-6 space-y-3">
              <label className="block text-sm font-black">
                Email address
                <div className="mt-2 flex items-center gap-2 rounded-2xl border bg-white px-4 focus-within:ring-2 focus-within:ring-green-500">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <input
                    className="min-w-0 flex-1 bg-transparent py-3 font-bold outline-none"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>
              <Button className="w-full" disabled={sending}>
                <ShieldCheck className="h-5 w-5" />
                {sending ? 'Sending…' : 'Send magic link'}
              </Button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-900">
              Cloud sync needs the Supabase URL and anonymous key configured on
              the server. Your local tracker will keep working until then.
            </div>
          )}

          {message ? (
            <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm font-bold text-green-800">
              {message}
            </p>
          ) : null}

          <Button asChild variant="ghost" className="mt-4 w-full">
            <Link href="/profile">
              <ArrowLeft className="h-5 w-5" /> Back to profile
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
