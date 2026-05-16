import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../../hooks/useAuth'
import { cn } from '../../lib/cn'

function getSafeRedirect(value: string | null) {
  const redirect = (value || '').trim()
  if (!redirect.startsWith('/')) return null
  if (redirect.startsWith('//')) return null
  if (redirect.startsWith('/admin')) return null
  return redirect
}

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, loading, error, clearError } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const isGuardRedirect = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('reason') === 'auth'
  }, [location.search])

  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return getSafeRedirect(params.get('redirect') || params.get('from'))
  }, [location.search])

  const isRegisterMode = mode === 'register'

  const validate = () => {
    const nextErrors: FieldErrors = {}

    if (isRegisterMode && !name.trim()) {
      nextErrors.name = 'Name is required.'
    }

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

    if (isRegisterMode && confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) return

    try {
      const result = isRegisterMode
        ? await register({ name, email, password })
        : await login({ email, password })
      navigate(result.role === 'admin' ? '/admin/dashboard' : redirectTarget || '/', {
        replace: true,
      })
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

  const onNameChange = (value: string) => {
    setName(value)
    if (fieldErrors.name) {
      setFieldErrors((current) => ({ ...current, name: undefined }))
    }
    if (error) clearError()
  }

  const onPasswordChange = (value: string) => {
    setPassword(value)
    if (fieldErrors.password) {
      setFieldErrors((current) => ({ ...current, password: undefined }))
    }
    if (fieldErrors.confirmPassword) {
      setFieldErrors((current) => ({ ...current, confirmPassword: undefined }))
    }
    if (error) clearError()
  }

  const onConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (fieldErrors.confirmPassword) {
      setFieldErrors((current) => ({ ...current, confirmPassword: undefined }))
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
        <p className="text-xs uppercase tracking-widest text-gray-400">Welcome Back</p>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-light text-4xl tracking-tight text-black md:text-5xl">
              {isRegisterMode ? 'Create account' : 'Sign in'}
            </h1>
            <p className="mt-3 text-gray-500">
              {isRegisterMode
                ? 'Create your guest account to book and track stays.'
                : 'Access your account and manage your reservations.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMode((current) => (current === 'login' ? 'register' : 'login'))
              setFieldErrors({})
              clearError()
            }}
            className="shrink-0 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-black hover:text-black"
          >
            {isRegisterMode ? 'Have account?' : 'Register'}
          </button>
        </div>
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
          {isRegisterMode ? (
            <>
              <label htmlFor="login-name" className="mb-3 block text-xs uppercase tracking-widest text-gray-400">
                Full name
              </label>
              <motion.input
                id="login-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'login-name-error' : undefined}
                className={cn(
                  'w-full border bg-white px-4 py-3 text-sm text-black outline-none transition-all duration-200 placeholder:text-gray-400',
                  fieldErrors.name
                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                    : 'border-gray-300 focus:border-black focus:ring-0',
                )}
                whileFocus={{ scale: 1.01 }}
              />
              {fieldErrors.name ? (
                <motion.p
                  id="login-name-error"
                  className="mt-2 text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {fieldErrors.name}
                </motion.p>
              ) : null}
            </>
          ) : null}

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

          {isRegisterMode ? (
            <>
              <label htmlFor="login-confirm-password" className="mb-3 mt-5 block text-xs uppercase tracking-widest text-gray-400">
                Confirm password
              </label>
              <motion.input
                id="login-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? 'login-confirm-password-error' : undefined}
                className={cn(
                  'w-full border bg-white px-4 py-3 text-sm text-black outline-none transition-all duration-200 placeholder:text-gray-400',
                  fieldErrors.confirmPassword
                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                    : 'border-gray-300 focus:border-black focus:ring-0',
                )}
                whileFocus={{ scale: 1.01 }}
              />
              {fieldErrors.confirmPassword ? (
                <motion.p
                  id="login-confirm-password-error"
                  className="mt-2 text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {fieldErrors.confirmPassword}
                </motion.p>
              ) : null}
            </>
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
        {loading ? (isRegisterMode ? 'Creating account...' : 'Signing in...') : isRegisterMode ? 'Create account' : 'Sign In'}
      </motion.button>

      <motion.p
        className="mt-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {isRegisterMode
          ? 'Tài khoản mới sẽ được tạo với role user.'
          : 'Demo quản trị: admin@viohotel.com / vio123456'}
      </motion.p>
    </form>
  )
}
