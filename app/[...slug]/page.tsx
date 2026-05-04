"use client"

import dynamic from 'next/dynamic'

const LegacyApp = dynamic(() => import('../../legacy/App'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-white" />,
})

export default function CatchAllLegacyPage() {
  return <LegacyApp />
}
