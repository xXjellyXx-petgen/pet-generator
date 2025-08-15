import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pet Generator',
  description: 'Pet Generator',
  generator: 'growagarden.app',
  openGraph: {
    title: 'Generator App',
    description: 'Created with v0',
    images: [
      'https://v0-pet-generator-growagarden.vercel.app/thumbnail.png',
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator App',
    description: 'Created with v0',
    images: [
      'https://v0-pet-generator-growagarden.vercel.app/thumbnail.png',
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
