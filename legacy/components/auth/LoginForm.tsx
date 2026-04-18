import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/cn'

const LOGIN_REDIRECT_STORAGE_KEY = 'vio_login_redirect_path'

function getSafeAdminRedirect(value: string | null) {
  const redirect = (value || '').trim()
  if (!redirect.startsWith('/')) return null
  if (!redirect.startsWith('/admin')) return null
  if (redirect.startsWith('//')) return null
  return redirect
}

type FieldErrors = {
  email?: string
  password?: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const hasFieldErrors = useMemo(
    () => Boolean(fieldErrors.email || fieldErrors.password),
    [fieldErrors],
  )

  const isGuardRedirect = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('reason') === 'auth'
  }, [location.search])

  const redirectAfterLogin = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const redirectFromQuery = getSafeAdminRedirect(params.get('redirect'))
    if (redirectFromQuery) return redirectFromQuery

    if (typeof window !== 'undefined') {
      const redirectFromStorage = getSafeAdminRedirect(
        sessionStorage.getItem(LOGIN_REDIRECT_STORAGE_KEY),
      )
      if (redirectFromStorage) return redirectFromStorage
    }

    return '/admin'
  }, [location.search])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(location.search)
    const redirectFromQuery = getSafeAdminRedirect(params.get('redirect'))

    if (redirectFromQuery) {
      sessionStorage.setItem(LOGIN_REDIRECT_STORAGE_KEY, redirectFromQuery)
      return
    }

    if (params.get('reason') !== 'auth') {
      sessionStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY)
    }
  }, [location.search])

  const validate = () => {
    const nextErrors: FieldErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password) {
      nextErrors.password = 'Password is required.'
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) return

    try {
      const result = await login({ email, password })
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY)
      }
      const nextPath =
        redirectAfterLogin !== '/admin'
          ? redirectAfterLogin
          : result.user.role === 'admin'
            ? '/admin'
            : '/'

      navigate(nextPath, { replace: true })
    } catch {
      // Error state is handled by useAuth and rendered in the form.
    }
  }

  const onEmailChange = (value: string) => {
    setEmail(value)
    if (fieldErrors.email) {
      setFieldErrors((current) => ({ ...current, email: undefined }))
    }
    if (error) clearError()
  }

  const onPasswordChange = (value: string) => {
    setPassword(value)
    if (fieldErrors.password) {
      setFieldErrors((current) => ({ ...current, password: undefined }))
    }
    if (error) clearError()
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[400px] p-8 md:p-6" noValidate>
      <p className="font-heading text-sm uppercase tracking-[0.2em] text-vio-gold">
        Welcome Back
      </p>
      <h1 className="mt-3 font-heading text-[36px] font-normal leading-tight text-vio-navy">
        Sign in to your account
      </h1>
      <p className="mt-2 text-sm text-vio-text-secondary">
        Access your bookings, manage reservations, and experience luxury.
      </p>

      {isGuardRedirect ? (
        <p className="mt-3 rounded-md border border-vio-gold/35 bg-vio-gold/10 px-3 py-2 text-xs text-vio-navy">
          Đăng nhập để truy cập trang này
        </p>
      ) : null}

      <div
        className={cn(
          'mt-5 overflow-hidden rounded-lg border border-vio-error/30 bg-vio-error/5 px-4 py-3 text-sm text-vio-error transition-all duration-200',
          error ? 'max-h-20 opacity-100' : 'max-h-0 border-transparent p-0 opacity-0',
        )}
        role="alert"
        aria-live="polite"
      >
        {error || 'Invalid email or password'}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-xs uppercase tracking-[0.05em] text-vio-text-secondary"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            className={cn(
              'w-full rounded-lg border bg-transparent px-4 py-3.5 text-sm text-vio-text-primary outline-none transition duration-150 placeholder:text-vio-text-secondary/50',
              fieldErrors.email
                ? 'border-vio-error ring-2 ring-vio-error/20'
                : 'border-vio-linen focus:border-vio-gold focus:ring-2 focus:ring-vio-gold/30',
            )}
          />
          {fieldErrors.email ? (
            <p id="login-email-error" className="mt-2 text-xs text-vio-error">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-xs uppercase tracking-[0.05em] text-vio-text-secondary"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
              className={cn(
                'w-full rounded-lg border bg-transparent px-4 py-3.5 pr-12 text-sm text-vio-text-primary outline-none transition duration-150 placeholder:text-vio-text-secondary/50',
                fieldErrors.password
                  ? 'border-vio-error ring-2 ring-vio-error/20'
                  : 'border-vio-linen focus:border-vio-gold focus:ring-2 focus:ring-vio-gold/30',
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-vio-text-secondary transition-colors duration-150 hover:text-vio-gold"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                  <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9.9 5.1A10.9 10.9 0 0 1 12 4.9C17.1 4.9 20.3 8.7 21.3 10.2C21.6 10.7 21.6 11.3 21.3 11.8A18.8 18.8 0 0 1 16.8 16.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M6.5 7.2A18.1 18.1 0 0 0 2.7 10.2C2.4 10.7 2.4 11.3 2.7 11.8C3.7 13.3 6.9 17.1 12 17.1C13 17.1 13.9 17 14.8 16.8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                  <path d="M2.7 12.2C3.7 10.7 6.9 6.9 12 6.9C17.1 6.9 20.3 10.7 21.3 12.2C21.6 12.7 21.6 13.3 21.3 13.8C20.3 15.3 17.1 19.1 12 19.1C6.9 19.1 3.7 15.3 2.7 13.8C2.4 13.3 2.4 12.7 2.7 12.2Z" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.password ? (
            <p id="login-password-error" className="mt-2 text-xs text-vio-error">
              {fieldErrors.password}
            </p>
          ) : null}
          <div className="mt-2 text-right">
            <Link
              to="/"
              className="text-sm text-vio-gold transition-all duration-150 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-vio-navy px-4 py-3.5 text-sm font-semibold tracking-[0.02em] text-vio-white transition-all duration-200 hover:scale-[1.02] hover:bg-vio-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-vio-gold/30 border-t-vio-gold"
              aria-hidden
            />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-vio-linen" aria-hidden />
        <span className="text-xs text-vio-text-secondary">or</span>
        <span className="h-px flex-1 bg-vio-linen" aria-hidden />
      </div>

      <p className="mt-5 text-center text-sm text-vio-text-secondary">
        Don't have an account?{' '}
        <Link to="/" className="text-vio-gold transition-all duration-150 hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-6 text-center text-xs text-vio-gold">
        Try demo account: admin@aurelia.com / aurelia123
      </p>

      {hasFieldErrors ? (
        <p className="mt-3 text-center text-xs text-vio-error">
          Please review the highlighted fields.
        </p>
      ) : null}
    </form>
  )
}
