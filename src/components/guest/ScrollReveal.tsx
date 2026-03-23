import { Children, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/cn'

const easeLux = [0.25, 0.1, 0.25, 1] as const

const containerVariants = {
  hidden: (y: number) => ({ opacity: 0, y }),
  show: {
    opacity: 1,
    y: 0,
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

type ScrollRevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode
  delay?: number
  y?: number
  duration?: number
  staggerChildren?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 22,
  duration = 0.78,
  staggerChildren = 0.1,
  ...props
}: ScrollRevealProps) {
  const items = Children.toArray(children)

  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      custom={y}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{
        duration,
        delay,
        ease: easeLux,
        staggerChildren,
        delayChildren: 0.04,
      }}
      {...props}
    >
      {items.map((child, index) => (
        <motion.div key={index} variants={childVariants} style={{ display: 'contents' }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
