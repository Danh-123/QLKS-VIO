import { motion } from 'framer-motion'
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
            <LoginForm />
          </div>
        </motion.section>
        <LoginHeroImage />
      </div>
    </motion.div>
  )
}
