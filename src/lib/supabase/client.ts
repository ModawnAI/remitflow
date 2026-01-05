import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Dev bypass: check if Supabase credentials are configured
const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ''
  );
};

export function createClient() {
  if (!isSupabaseConfigured()) {
    console.warn('[DEV MODE] Supabase not configured - returning null client');
    return null;
  }
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton instance for client-side usage
let browserClient: ReturnType<typeof createClient> | undefined;

export function getClient() {
  if (typeof window === 'undefined') {
    throw new Error('getClient() should only be called on the client side');
  }

  if (!browserClient) {
    browserClient = createClient();
  }

  return browserClient;
}
