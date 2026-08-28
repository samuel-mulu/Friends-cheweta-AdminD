'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const { user, login } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace(search.get('next') || '/overview');
  }, [user, router, search]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(phone, password);
      router.replace(search.get('next') || '/overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className='flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-sm'>
        <div className='mb-9 lg:hidden'>
          <div className='mb-5 grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground'>
            <ShieldCheck className='h-5 w-5' />
          </div>
        </div>
        <p className='text-sm font-medium text-primary'>Admin access</p>
        <h2 className='mt-2 text-3xl font-semibold tracking-tight'>Welcome back</h2>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>Sign in with an account assigned the ADMIN role.</p>
        <form className='mt-8 space-y-5' onSubmit={submit}>
          <label className='block'>
            <span className='mb-2 block text-sm font-medium'>Phone number</span>
            <Input autoComplete='username' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='0911 234 567' required />
          </label>
          <label className='block'>
            <span className='mb-2 block text-sm font-medium'>Password</span>
            <Input type='password' autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className='rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-700 dark:text-red-300'>{error}</div>}
          <Button className='w-full' size='lg' disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className='min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_.95fr]'>
      <section className='hidden border-r bg-[#10251d] p-12 text-white lg:flex lg:flex-col lg:justify-between'>
        <div className='flex items-center gap-3 text-sm font-semibold'>
          <div className='grid h-9 w-9 place-items-center rounded-xl bg-white/10'>
            <ShieldCheck className='h-5 w-5' />
          </div>
          Friends Game Hub
        </div>
        <div className='max-w-xl'>
          <p className='mb-5 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200/70'>Operations console</p>
          <h1 className='text-5xl font-semibold leading-[1.08] tracking-tight'>Run the platform with clarity, not noise.</h1>
          <p className='mt-6 max-w-lg text-base leading-7 text-white/65'>Players, matches, payments and risk signals in one restrained operations workspace.</p>
        </div>
        <p className='text-xs text-white/40'>Internal administration · Authorized access only</p>
      </section>
      <Suspense fallback={<section className='flex min-h-screen items-center justify-center p-6 text-sm text-muted-foreground'>Loading sign in…</section>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
