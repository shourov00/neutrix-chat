import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'neutrix-flex neutrix-h-10 neutrix-w-full neutrix-rounded-xl neutrix-border neutrix-border-input neutrix-bg-background neutrix-px-3 neutrix-py-2 neutrix-text-sm neutrix-ring-offset-background neutrix-file-border-0 neutrix-file-bg-transparent neutrix-file-text-sm neutrix-file-font-medium placeholder:neutrix-text-muted-foreground neutrix-focus-visible:outline-none neutrix-focus-visible:ring-2 neutrix-focus-visible:ring-ring neutrix-focus-visible:ring-offset-2 neutrix-disabled:cursor-not-allowed neutrix-disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
