import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasAuthToken } from '../../hooks/useAuth'

function getSafeRedirectFromSearch(search: string) {
  const params = new URLSearchParams(search)
  const redirect = params.get('redirect') || ''

  if (!redirect.startsWith('/')) return null
  if (!redirect.startsWith('/admin')) return null
  if (redirect.startsWith('//')) return null

  return redirect
}

function hasForceLogin(search: string) {
  const params = new URLSearchParams(search)
  return params.get('force') === '1'
}

export function AdminRouteGuard() {
  const location = useLocation()

  if (!hasAuthToken()) {
    const target = `${location.pathname}${location.search}${location.hash}`
    const redirectParam = encodeURIComponent(target)
    return <Navigate to={`/login?redirect=${redirectParam}&reason=auth`} replace />
  }

  return <Outlet />
}

export function LoginRouteGuard() {
  const location = useLocation()

  if (hasAuthToken() && !hasForceLogin(location.search)) {
    const redirect = getSafeRedirectFromSearch(location.search)
    return <Navigate to={redirect || '/admin'} replace />
  }

  return <Outlet />
}
