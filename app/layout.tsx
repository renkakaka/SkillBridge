import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import ClientNavbar from '@/components/ClientNavbar'
import ToastHost from '@/components/ToastHost'
import { AuthProvider } from '@/lib/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillBridge - Develop Skills with Experts',
  description: 'Career development platform that connects newcomers with experienced professionals. Get practical experience working on real projects.',
  keywords: ['mentorship', 'projects', 'career', 'experience', 'skills', 'development', 'design'],
  authors: [{ name: 'SkillBridge Team' }],
  openGraph: {
    title: 'SkillBridge - Develop Skills with Experts',
    description: 'Career development platform that connects newcomers with experienced professionals. Get practical experience working on real projects.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillBridge - Develop Skills with Experts',
    description: 'Career development platform that connects newcomers with experienced professionals. Get practical experience working on real projects.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <ScrollProgress />
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <ClientNavbar />
            <ToastHost />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
