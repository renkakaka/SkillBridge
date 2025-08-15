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

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillBridge - Զարգացրեք հմտությունները փորձագետների հետ',
  description: 'Կարիերայի զարգացման հարթակ, որը միավորում է նորեկներին փորձառու մասնագետների հետ: Ստացեք գործնական փորձ՝ աշխատելով իրական ծրագրերի վրա:',
  keywords: ['մենթորություն', 'ծրագրեր', 'կարիերա', 'փորձ', 'հմտություններ', 'զարգացում', 'դիզայն'],
  authors: [{ name: 'SkillBridge Team' }],
  openGraph: {
    title: 'SkillBridge - Զարգացրեք հմտությունները փորձագետների հետ',
    description: 'Կարիերայի զարգացման հարթակ, որը միավորում է նորեկներին փորձառու մասնագետների հետ: Ստացեք գործնական փորձ՝ աշխատելով իրական ծրագրերի վրա:',
    type: 'website',
    locale: 'hy_AM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillBridge - Զարգացրեք հմտությունները փորձագետների հետ',
    description: 'Կարիերայի զարգացման հարթակ, որը միավորում է նորեկներին փորձառու մասնագետների հետ: Ստացեք գործնական փորձ՝ աշխատելով իրական ծրագրերի վրա:',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5174'),
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
    <html lang="hy" className="scroll-smooth">
      <body className={inter.className}>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <ScrollProgress />
        <div className="flex min-h-screen flex-col">
          <ClientNavbar />
          <ToastHost />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
