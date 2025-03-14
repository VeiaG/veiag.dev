import React from 'react'
import './styles.css'
import NoiseOverlay from '../../components/NoiseOverlay'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
  description:
    'Welcome to my portfolio! I’m Roman, a web developer passionate about building modern, user-friendly websites and applications. Check out my projects and see what I’ve been working on!',
  title: 'veiag.dev',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
      <body className="bg-zinc-950 text-white relative dark flex flex-col">
        <Navigation />
        <NoiseOverlay className="z-[-1]" />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
