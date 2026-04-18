import { Cormorant_Garamond, Cormorant_SC, Inter } from 'next/font/google'

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const cormorantSc = Cormorant_SC({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant-sc',
  display: 'swap',
})
