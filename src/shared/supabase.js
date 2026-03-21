import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gmjxcgblzfjqhaavgjgh.supabase.co'
const supabaseAnonKey = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc'

// Official Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- HYBRID HELPERS ---
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const LOCAL_API_URL = isLocal ? 'http://localhost:3000' : 'https://api.vuanedit.online';

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
