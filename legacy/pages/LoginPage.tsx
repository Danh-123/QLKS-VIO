import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { LoginHeroImage } from '../components/auth/LoginHeroImage'

export function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative min-h-dvh bg-white"
    >
      <div className="relative flex min-h-dvh">
        <motion.section
          className="flex w-full items-center justify-center px-4 py-12 md:w-1/2 md:px-12 lg:px-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <div className="w-full max-w-[420px]">
            <Link
              to="/"
              aria-label="Về trang chủ"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-black hover:text-black md:mb-8"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>Trang chủ</span>
            </Link>
            <LoginForm />
          </div>
        </motion.section>
        <LoginHeroImage />
      </div>
    </motion.div>
  )
}
