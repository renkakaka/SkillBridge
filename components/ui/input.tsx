import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'search' | 'success' | 'error' | 'glass'
  size?: 'sm' | 'default' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  label?: string
  error?: string
  success?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant = 'default',
    size = 'default',
    leftIcon,
    rightIcon,
    label,
    error,
    success,
    hint,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const inputType = type === 'password' && showPassword ? 'text' : type

    const variants = {
      default: "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2",
      search: "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 pl-10",
      success: "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2",
      error: "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2",
      glass: "border-white/20 bg-white/20 backdrop-blur-sm focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
    }

    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-11 px-4 text-base",
      lg: "h-12 px-5 text-lg"
    }

    const getRightIcon = () => {
      if (type === 'password') {
        return (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )
      }
      
      if (error) {
        return <AlertCircle className="h-4 w-4 text-red-500" />
      }
      
      if (success) {
        return <CheckCircle className="h-4 w-4 text-green-500" />
      }
      
      return rightIcon
    }

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              "flex w-full rounded-xl border-2 bg-white text-neutral-900 placeholder:text-neutral-400",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "file:file:mr-4 file:py-2 file:px-4",
              "file:rounded-lg file:border file:border-neutral-200",
              "file:hover:bg-neutral-50 file:hover:border-neutral-300",
              variants[variant],
              sizes[size],
              leftIcon && "pl-10",
              (type === 'password' || error || success || rightIcon) && "pr-10",
              className
            )}
            ref={ref}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {getRightIcon() && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getRightIcon()}
            </div>
          )}
        </div>
        
        {(error || success || hint) && (
          <div className="flex items-center space-x-2 text-sm">
            {error && (
              <span className="text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </span>
            )}
            {success && (
              <span className="text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {success}
              </span>
            )}
            {hint && !error && !success && (
              <span className="text-neutral-500">{hint}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Enhanced input variants
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'variant' | 'leftIcon'>>(
  (props, ref) => (
    <Input
      ref={ref}
      variant="search"
      leftIcon={<Search className="h-4 w-4" />}
      placeholder="Поиск..."
      {...props}
    />
  )
)
SearchInput.displayName = "SearchInput"

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="password"
      {...props}
    />
  )
)
PasswordInput.displayName = "PasswordInput"

const EmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="email"
      placeholder="email@example.com"
      {...props}
    />
  )
)
EmailInput.displayName = "EmailInput"

export { Input, SearchInput, PasswordInput, EmailInput }
