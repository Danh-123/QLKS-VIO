import type { Metadata } from 'next'
import {
  cormorantGaramond,
  cormorantSc,
  inter,
} from './fonts'
import './globals.css'
import '../legacy/index.css'

export const metadata: Metadata = {
  title: 'QLKS VIO',
  description: 'QLKS-VIO running on Next.js with preserved legacy UI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable} ${cormorantSc.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
      </body>
    </html>
  )
}
