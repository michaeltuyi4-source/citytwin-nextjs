'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function SignOutButton({ className = 'nav-cta' }: { className?: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSignedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (!signedIn) return null;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <button onClick={handleSignOut} className={className} style={{ cursor: 'pointer' }}>
      Sign out
    </button>
  );
}
