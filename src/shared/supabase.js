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

// --- HYBRID HELPERS ---
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export let LOCAL_API_URL = isLocal ? 'http://localhost:3000' : 'https://api.vuanedit.online';

// Function to fetch the active tunnel URL from Supabase
export async function syncLocalApiUrl() {
    try {
        const { data, error } = await supabase.from('app_config').select('value').eq('key', 'tunnel_url').single();
        if (data && data.value) {
            LOCAL_API_URL = data.value;
            localStorage.setItem('vuanedit_api_url', LOCAL_API_URL);
            console.log("[Supabase Sync] API URL updated to:", LOCAL_API_URL);
            return LOCAL_API_URL;
        }
    } catch (err) {
        console.warn("[Supabase Sync] Could not fetch tunnel_url, using fallback.");
    }
    
    // Fallback to localStorage if sync fails
    const savedApiUrl = localStorage.getItem('vuanedit_api_url');
    if (savedApiUrl) {
        LOCAL_API_URL = savedApiUrl;
    }
    return LOCAL_API_URL;
}

// Initial sync
syncLocalApiUrl();

/**
 * Tra ve URL file tu may ca nhan thay vi Supabase Storage.
 * @param {string} path - Duong dan file (vd: 'vietnam_provinces.geojson')
 * @param {string} bucket - Ten thung chua ('geodata' hoac 'products')
 */
export function getLocalFileUrl(path, bucket = 'geodata') {
    return `${LOCAL_API_URL}/storage/${bucket}/${path}`;
}

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
