import { createClient } from '@supabase/supabase-js'

// Supabase client (credentials loaded from environment variables only)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.')
}

// Official Supabase Client
// Provide a safe initialization that doesn't crash the script if env variables are missing
let supabaseClient;
try {
    if (supabaseUrl && supabaseAnonKey) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    } else {
        // Mock client to avoid crashing on import, though features won't work
        supabaseClient = {
            from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: 'Supabase keys missing' }) }) }), order: () => Promise.resolve({ data: [], error: 'Supabase keys missing' }) }),
            auth: { getUser: () => Promise.resolve({ data: { user: null } }), signInWithPassword: () => Promise.resolve({ error: 'Supabase keys missing' }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) }
        };
    }
} catch (e) {
    console.error("[Supabase] Failed to initialize:", e);
    supabaseClient = {}; // Final fallback
}

export const supabase = supabaseClient;

// Auth Helpers (Using Official Supabase)
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

