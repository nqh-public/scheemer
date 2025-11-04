/**
 * @what Button component for Framer plugin UI
 * @why Provides consistent, Framer-styled buttons matching native design tokens
 * @props variant (default|ghost|outline), size (default|sm|icon), fullWidth, ...HTMLButtonProps
 */

import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "outline"
    size?: "default" | "sm" | "icon"
    fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", size = "default", fullWidth, children, ...props }, ref) => {
        const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"

        const variantClasses = {
            default: "bg-framer-tint text-white hover:opacity-90",
            ghost: "hover:bg-framer-bg-secondary text-framer-text",
            outline: "border border-framer-divider hover:bg-framer-bg-secondary text-framer-text"
        }

        const sizeClasses = {
            default: "px-4 py-2 text-sm whitespace-nowrap",
            sm: "px-2 py-1 text-xs whitespace-nowrap",
            icon: "w-8 h-8 p-0 shrink-0"
        }

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = "Button"
