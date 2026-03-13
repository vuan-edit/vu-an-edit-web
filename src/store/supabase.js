import { createClient } from '@supabase/supabase-js'

// ⚠️ PLACEHOLDER CREDENTIALS ⚠️
// We will ask the user to provide these from their Supabase dashboard.
const supabaseUrl = 'https://gmjxcgblzfjqhaavgjgh.supabase.co'
const supabaseAnonKey = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth Helpers
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
