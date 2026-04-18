import { motion } from 'framer-motion'
import { LoginForm } from '../components/auth/LoginForm'
import { LoginHeroImage } from '../components/auth/LoginHeroImage'

export function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative min-h-dvh overflow-hidden bg-vio-cream"
    >
      <div className="relative z-10 flex min-h-dvh">
        <section className="flex w-full items-center justify-center px-6 py-10 md:w-1/2 md:px-10">
          <div className="w-full max-w-[440px] rounded-2xl bg-vio-white/80 backdrop-blur-[1px] md:bg-transparent md:backdrop-blur-0">
            <LoginForm />
          </div>
        </section>
        <LoginHeroImage />
      </div>
    </motion.div>
  )
}
