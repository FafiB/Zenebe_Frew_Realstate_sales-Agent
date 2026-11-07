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

export async function uploadMedia(file, folder) {
  if (!supabase) throw new Error("Supabase is not configured for this deployment.");
  if (!file) return "";
  if (file.size === 0) throw new Error("Choose a media file that is not empty.");

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session?.access_token) {
    throw new Error("Sign in as an administrator before uploading media.");
  }

  const params = new URLSearchParams({ folder, filename: file.name });
  const response = await fetch(`/api/media-upload?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionData.session.access_token}`,
      "Content-Type": file.type,
    },
    body: file,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Media upload failed (${response.status}).`);
  }
  if (typeof result.url !== "string" || !result.url) {
    throw new Error("Media upload completed without returning a public URL.");
  }
  return result.url;
}
