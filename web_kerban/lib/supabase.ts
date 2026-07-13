import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase() {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Supabase credentials not configured");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as any)[prop];
  },
});

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "kerban-uploads";

export async function uploadFile(file: File, folder: string): Promise<string | null> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, buffer, { contentType: file.type, upsert: false });
  if (error) { console.error("Supabase upload error:", error); return null; }
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteFile(url: string): Promise<boolean> {
  const path = url.split(`${STORAGE_BUCKET}/`).pop();
  if (!path) return false;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  return !error;
}
