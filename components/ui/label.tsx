'use client'

import * as React from 'react'

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={
        'block text-sm font-medium text-neutral-700 ' + (className || '')
      }
      {...props}
    />
  )
}

export default Label



