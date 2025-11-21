declare global {
  interface Window {
    __APP_DISABLED_SERVICES__?: Record<string, boolean>;
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfig = SUPABASE_URL && SUPABASE_ANON_KEY
  ? {
    url: SUPABASE_URL as string,
    anonKey: SUPABASE_ANON_KEY as string,
  }
  : null;

export function ensureOptionalSupabaseConfig(): boolean {
  if (supabaseConfig) {
    return true;
  }

  if (typeof window !== 'undefined') {
    window.__APP_DISABLED_SERVICES__ = {
      ...(window.__APP_DISABLED_SERVICES__ ?? {}),
      supabase: true,
    };
  }

  if (import.meta.env.DEV) {
    console.info('[Supabase] Client disabled: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
  }

  return false;
}
