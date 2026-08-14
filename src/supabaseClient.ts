import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gosyzjdobosofshemfvr.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvc3l6amRvYm9zb2ZzaGVtZnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2Njg1MjEsImV4cCI6MjEwMjI0NDUyMX0.zCBIYhamWl3207S3byifT431Ho3DbXSg544e4rdXQv0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
