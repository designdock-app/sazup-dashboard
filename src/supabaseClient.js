// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://evlmtgqwvxeaecexrrax.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bG10Z3F3dnhlYWVjZXhycmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDg5MzUsImV4cCI6MjA2ODMyNDkzNX0.Xt7TbRARJkO1iuJHbx9WLoFzNpMf5K5Bcfopl_XV4m4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
