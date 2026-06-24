import { createBrowserClient } from '@supabase/ssr';

// Reuse a single browser client across the whole app. Creating a new
// GoTrueClient per component causes multiple instances to contend on the
// auth refresh lock, which can stall getSession() on pages with several
// clients (results, places). One shared instance is the recommended pattern.
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key';
  browserClient = createBrowserClient(url, key);
  return browserClient;
}
