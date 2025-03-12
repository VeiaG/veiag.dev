import React from 'react'
import './styles.css'
import NoiseOverlay from '../../components/NoiseOverlay'
import Navigation from '@/components/Navigation'

export const metadata = {
  description: 'VeiaG',
  title: 'VeiaG',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
      <body className="bg-zinc-950 text-white relative dark">
        <Navigation />
        <NoiseOverlay className="z-[-1]" />
        <main>{children}</main>
      </body>
    </html>
  )
}
