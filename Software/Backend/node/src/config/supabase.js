import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be configured');
}

export const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function ensureDemoUser() {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  if (data.users.some((user) => user.email === 'demo@solvehub.local')) return;

  const { error: createError } = await supabase.auth.admin.createUser({
    email: 'demo@solvehub.local',
    password: 'demo password',
    email_confirm: true,
    user_metadata: { name: 'Demo User', role: 'solver' },
  });
  if (createError) throw createError;
  console.log('Supabase demo user created');
}
