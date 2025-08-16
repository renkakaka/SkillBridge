'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-white hover:bg-primary-600",
        secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        destructive: "border-transparent bg-error-500 text-white hover:bg-error-600",
        outline: "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
        success: "border-transparent bg-success-500 text-white hover:bg-success-600",
        warning: "border-transparent bg-warning-500 text-white hover:bg-warning-600",
        info: "border-transparent bg-secondary-500 text-white hover:bg-secondary-600",
        gradient: "border-transparent bg-gradient-to-r from-primary-500 to-secondary-500 text-white",
        glass: "border-white/20 bg-white/20 backdrop-blur-sm text-white",
        premium: "border-transparent bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
        new: "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
        featured: "border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin",
        ping: "animate-ping",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, animation, icon, removable, onRemove, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, animation, className }))}
        {...props}
      >
        {icon && <span className="mr-1 flex items-center">{icon}</span>}
        {children}
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
            aria-label="Удалить"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

// Enhanced badge variants
const StatusBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & { status: 'online' | 'offline' | 'away' | 'busy' }>(
  ({ status, ...props }, ref) => {
    const statusConfig = {
      online: { variant: 'success' as const, icon: <div className="h-2 w-2 rounded-full bg-current" /> },
      offline: { variant: 'secondary' as const, icon: <div className="h-2 w-2 rounded-full bg-current" /> },
      away: { variant: 'warning' as const, icon: <div className="h-2 w-2 rounded-full bg-current" /> },
      busy: { variant: 'destructive' as const, icon: <div className="h-2 w-2 rounded-full bg-current" /> },
    }

    const config = statusConfig[status]
    
    return (
      <Badge
        ref={ref}
        variant={config.variant}
        icon={config.icon}
        {...props}
      />
    )
  }
)
StatusBadge.displayName = "StatusBadge"

const PriorityBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & { priority: 'low' | 'medium' | 'high' | 'urgent' }>(
  ({ priority, ...props }, ref) => {
    const statusConfig: Record<'low' | 'medium' | 'high' | 'urgent', { variant: NonNullable<BadgeProps['variant']>; text: string; animation: NonNullable<BadgeProps['animation']> }> = {
      low: { variant: 'success', text: 'Низкий', animation: 'none' },
      medium: { variant: 'warning', text: 'Средний', animation: 'none' },
      high: { variant: 'destructive', text: 'Высокий', animation: 'none' },
      urgent: { variant: 'destructive', text: 'Срочно', animation: 'pulse' },
    }

    const config = statusConfig[priority]
    
    return (
      <Badge
        ref={ref}
        variant={config.variant}
        animation={config.animation}
        {...props}
      >
        {config.text}
      </Badge>
    )
  }
)
PriorityBadge.displayName = "PriorityBadge"

const CategoryBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & { category: string }>(
  ({ category, ...props }, ref) => {
    const categoryColors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'info'> = {
      'frontend': 'secondary',
      'backend': 'default',
      'mobile': 'default',
      'design': 'warning',
      'marketing': 'info',
      'sales': 'success',
      'support': 'secondary',
    }

    const variant = categoryColors[category] || 'default'
    
    return (
      <Badge
        ref={ref}
        variant={variant}
        {...props}
      >
        {category}
      </Badge>
    )
  }
)
CategoryBadge.displayName = "CategoryBadge"

export { Badge, StatusBadge, PriorityBadge, CategoryBadge, badgeVariants }
