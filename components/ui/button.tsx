'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2",
        destructive: "bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2",
        outline: "border-2 border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md hover:-translate-y-1 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2",
        secondary: "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 hover:shadow-md hover:-translate-y-1 focus:ring-2 focus:ring-neutral-500/20 focus:ring-offset-2",
        ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 hover:shadow-sm hover:-translate-y-1 focus:ring-2 focus:ring-neutral-500/20 focus:ring-offset-2",
        link: "text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline hover:-translate-y-1",
        gradient: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2",
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-white/30 hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-white/20 focus:ring-offset-2",
        success: "bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2",
        warning: "bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-yellow-500/20 focus:ring-offset-2",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 py-2",
        lg: "h-12 rounded-xl px-8 py-4 text-base",
        xl: "h-14 rounded-xl px-10 py-5 text-lg",
        icon: "h-10 w-10",
      },
      animation: {
        default: "",
        bounce: "hover:animate-bounce",
        pulse: "hover:animate-pulse",
        spin: "hover:animate-spin",
        wiggle: "hover:animate-wiggle",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = props.asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
