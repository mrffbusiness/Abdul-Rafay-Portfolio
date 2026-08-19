// ============================================================
// SUPABASE CONFIG
// The anon/publishable key below is SAFE to expose in front-end
// code — it only allows what your Row Level Security policies
// permit (public read, authenticated-only write).
// Never put your service_role/secret key in this file.
// ============================================================

const SUPABASE_URL = 'https://skuwxffersqrxvnzmmch.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Rwdnu9MuX_pL18S3ET_3BA_QkatY4PB';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
