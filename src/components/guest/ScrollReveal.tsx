import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/cn'

const easeLux = [0.25, 0.1, 0.25, 1] as const

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.72,
  ...props
}: HTMLMotionProps<'div'> & {
  delay?: number
  y?: number
  duration?: number
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{
        duration,
        delay,
        ease: easeLux,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
