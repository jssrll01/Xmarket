import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_KEY;

if (!url || !key) {
  console.warn('[supabase] Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_KEY. Restart the dev server after adding .env.local.');
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
