/**
 * Biến NEXT_PUBLIC_* dùng trên client.
 * File đặt trong `lib/` (không nằm trong `legacy/`) để Next luôn bundle kèm giá trị từ `.env.local`.
 */
export function getAdminApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL?.trim()
  if (!raw) return ''
  return raw.replace(/\/+$/, '')
}

export function getAuthLoginUrl(): string {
  const raw = process.env.NEXT_PUBLIC_AUTH_LOGIN_URL?.trim()
  if (raw) return raw
  return '/api/auth/login'
}
