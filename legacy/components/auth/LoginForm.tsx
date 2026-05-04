import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Welcome Back
        </p>
        <h1 className="mt-4 font-light text-4xl tracking-tight text-black md:text-5xl">
          Sign in
        </h1>
        <p className="mt-3 text-gray-500">
          Access your account and manage your reservations.
        </p>
      </motion.div>

      {isGuardRedirect ? (
        <motion.p
          className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Please sign in to access this page.
        </motion.p>
      ) : null}

      <motion.div
        className={cn(
          'mt-5 overflow-hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 transition-all duration-200',
          error ? 'max-h-20 opacity-100' : 'max-h-0 border-transparent p-0 opacity-0',
        )}
        role="alert"
        aria-live="polite"
        initial={false}
        animate={{ maxHeight: error ? 80 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {error || 'Invalid email or password'}
      </motion.div>

      <motion.div
        className="mt-8 space-y-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
        >
          <label htmlFor="login-email" className="mb-3 block text-xs uppercase tracking-widest text-gray-400">
            Email
          </label>
          <motion.input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            className={cn(
              'w-full border bg-white px-4 py-3 text-sm text-black outline-none transition-all duration-200 placeholder:text-gray-400',
              fieldErrors.email
                ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                : 'border-gray-300 focus:border-black focus:ring-0',
            )}
            whileFocus={{ scale: 1.01 }}
          />
          {fieldErrors.email ? (
            <motion.p
              id="login-email-error"
              className="mt-2 text-xs text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {fieldErrors.email}
            </motion.p>
          ) : null}
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="login-password" className="text-xs uppercase tracking-widest text-gray-400">
              Password
            </label>
            <motion.button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-xs text-gray-400 transition-colors duration-200 hover:text-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </motion.button>
          </div>
          <motion.input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            className={cn(
              'w-full border bg-white px-4 py-3 text-sm text-black outline-none transition-all duration-200 placeholder:text-gray-400',
              fieldErrors.password
                ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                : 'border-gray-300 focus:border-black focus:ring-0',
            )}
            whileFocus={{ scale: 1.01 }}
          />
          {fieldErrors.password ? (
            <motion.p
              id="login-password-error"
              className="mt-2 text-xs text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {fieldErrors.password}
            </motion.p>
          ) : null}
          <div className="mt-3 text-right">
            <Link
              to="/"
              className="text-xs text-gray-500 transition-colors duration-200 hover:text-black"
            >
              Forgot password?
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        type="submit"
        disabled={loading}
        className="mt-8 w-full bg-black px-6 py-3 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-black"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </motion.button>

      <motion.p
        className="mt-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Demo: admin@aurelia.com / aurelia123
      </motion.p>
    </form>
  )
}
