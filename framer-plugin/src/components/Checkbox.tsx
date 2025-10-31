/**
 * Checkbox - Simplified version from @nqh/hui for Framer plugin
 */

import * as React from "react"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className = "", onCheckedChange, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e)
            onCheckedChange?.(e.target.checked)
        }

        return (
            <input
                ref={ref}
                type="checkbox"
                className={`w-4 h-4 cursor-pointer rounded border-framer-divider accent-framer-tint focus:outline-none focus:ring-2 focus:ring-framer-tint focus:ring-offset-0 ${className}`}
                onChange={handleChange}
                {...props}
            />
        )
    }
)

Checkbox.displayName = "Checkbox"
