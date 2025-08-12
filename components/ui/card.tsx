import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean
    glass?: boolean
    gradient?: boolean
  }
>(({ className, hover = false, glass = false, gradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-neutral-200 bg-white text-neutral-950 shadow-sm transition-all duration-300 ease-out",
      hover && "hover:shadow-xl hover:-translate-y-2 hover:border-primary-200",
      glass && "bg-white/80 backdrop-blur-md border-white/20 shadow-lg",
      gradient && "bg-gradient-to-br from-white to-neutral-50",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-neutral-900",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-600 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced card variants
const CardInteractive = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'glass' | 'gradient'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-white border-neutral-200 hover:border-primary-200",
    elevated: "bg-white border-neutral-200 shadow-lg hover:shadow-2xl hover:border-primary-200",
    glass: "bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/90",
    gradient: "bg-gradient-to-br from-white to-neutral-50 border-neutral-200 hover:from-primary-50 hover:to-secondary-50"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border transition-all duration-300 ease-out cursor-pointer group",
        "hover:shadow-xl hover:-translate-y-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
CardInteractive.displayName = "CardInteractive"

const CardStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string | number
    label: string
    icon?: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
  }
>(({ className, value, label, icon, trend, trendValue, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-neutral-200 bg-white p-6 text-center transition-all duration-300 ease-out",
      "hover:shadow-lg hover:-translate-y-1 hover:border-primary-200",
      className
    )}
    {...props}
  >
    {icon && (
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
        {icon}
      </div>
    )}
    <div className="text-3xl font-bold text-neutral-900 mb-2">{value}</div>
    <div className="text-sm text-neutral-600 mb-3">{label}</div>
    {trend && trendValue && (
      <div className={cn(
        "flex items-center justify-center text-sm font-medium",
        trend === 'up' && "text-success-600",
        trend === 'down' && "text-error-600",
        trend === 'neutral' && "text-neutral-600"
      )}>
        <span className="mr-1">
          {trend === 'up' && '↗'}
          {trend === 'down' && '↘'}
          {trend === 'neutral' && '→'}
        </span>
        {trendValue}
      </div>
    )}
  </div>
))
CardStats.displayName = "CardStats"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardInteractive,
  CardStats
}
