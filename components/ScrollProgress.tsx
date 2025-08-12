'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollProgress() {
  const pathname = usePathname()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (pathname !== '/') return

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
      const maxScrollable = Math.max(docHeight - window.innerHeight, 0)
      const progress = maxScrollable === 0 ? 0 : Math.min(Math.max(scrollTop / maxScrollable, 0), 1) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress)
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [pathname])

  if (pathname !== '/') return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200 z-[60] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
