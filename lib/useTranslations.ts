'use client'

import { useMemo } from 'react'
import { translations } from './translations'

export function useTranslations() {
  const t = useMemo(() => {
    return (path: string): string => {
      const keys = path.split('.')
      let current: unknown = translations

      for (const key of keys) {
        if (
          current &&
          typeof current === 'object' &&
          key in (current as Record<string, unknown>)
        ) {
          current = (current as Record<string, unknown>)[key]
        } else {
          console.warn(`Translation key not found: ${path}`)
          return path
        }
      }

      return typeof current === 'string' ? current : path
    }
  }, [])

  return { t }
}
