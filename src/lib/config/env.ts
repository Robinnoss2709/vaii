import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

if (!PUBLIC_SUPABASE_URL) {
  throw new Error('Missing PUBLIC_SUPABASE_URL environment variable')
}

if (!PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabaseConfig = {
  url: PUBLIC_SUPABASE_URL,
  anonKey: PUBLIC_SUPABASE_ANON_KEY
}