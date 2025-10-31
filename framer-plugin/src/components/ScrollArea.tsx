/**
 * ScrollArea - Simplified scroll container for Framer plugin
 */

import * as React from "react"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`overflow-y-auto scrollbar-thin scrollbar-thumb-framer-divider scrollbar-track-transparent hover:scrollbar-thumb-framer-text-tertiary ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)

ScrollArea.displayName = "ScrollArea"
