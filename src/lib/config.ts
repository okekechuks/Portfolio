export function isRemoteStorageEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}
