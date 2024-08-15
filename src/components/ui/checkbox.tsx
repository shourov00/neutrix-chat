import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'neutrix-peer neutrix-h-4 neutrix-w-4 neutrix-shrink-0 neutrix-rounded-sm neutrix-border neutrix-border-primary neutrix-ring-offset-background neutrix-focus-visible:outline-none neutrix-focus-visible:ring-2 neutrix-focus-visible:ring-ring neutrix-focus-visible:ring-offset-2 neutrix-disabled:cursor-not-allowed neutrix-disabled:opacity-50 data-[state=checked]:neutrix-bg-primary data-[state=checked]:neutrix-text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        'neutrix-flex neutrix-items-center neutrix-justify-center neutrix-text-current',
      )}
    >
      <Check className="neutrix-h-4 neutrix-w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
