import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'neutrix-flex min-h-[80px] neutrix-w-full neutrix-resize-none neutrix-rounded-xl neutrix-border neutrix-border-input neutrix-bg-background neutrix-px-3 neutrix-py-2 neutrix-text-sm neutrix-ring-offset-background placeholder:neutrix-text-muted-foreground neutrix-focus-visible:outline-none neutrix-focus-visible:ring-2 neutrix-focus-visible:ring-ring neutrix-focus-visible:ring-offset-2 neutrix-disabled:cursor-not-allowed neutrix-disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
