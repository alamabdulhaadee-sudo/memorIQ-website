import { createClient } from '@supabase/supabase-js';

// Browser-side Supabase client using the public anon key.
// Safe to use in client components — the anon key is intentionally public.
// RLS policies enforce what this client can and cannot access.

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) {
  throw new Error(
    'Missing Supabase environment variables: ' +
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.',
  );
}

export const supabase = createClient(url, key);
