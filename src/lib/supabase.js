import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  : null;

export const mediaBucket = "real-estate-media";

export function getPublicMediaUrl(path) {
  if (!supabase || !path) return "";
  return supabase.storage.from(mediaBucket).getPublicUrl(path).data.publicUrl;
}

export async function uploadMedia(file, folder) {
  if (!supabase) throw new Error("Supabase is not configured for this deployment.");
  if (!file) return "";

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(mediaBucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return getPublicMediaUrl(path);
}
