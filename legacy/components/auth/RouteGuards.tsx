import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getStoredUser } from '../../../hooks/useAuth'

export function AdminRouteGuard() {
  const location = useLocation()
  const user = getStoredUser()

  if (!user) {
    return <Navigate to={`/login?reason=auth&from=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <Outlet />
}

export function LoginRouteGuard() {
  const user = getStoredUser()

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} replace />
  }

  return <Outlet />
}

export function AuthRouteGuard() {
  const location = useLocation()
  const user = getStoredUser()

  if (!user) {
    return <Navigate to={`/login?reason=auth&from=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <Outlet />
}
