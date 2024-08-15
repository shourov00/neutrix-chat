import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'neutrix-outline-none neutrix-inline-flex neutrix-items-center neutrix-justify-center neutrix-whitespace-nowrap neutrix-rounded-xl neutrix-text-sm neutrix-font-medium neutrix-ring-offset-background neutrix-transition-colors neutrix-disabled:pointer-events-none neutrix-disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'neutrix-bg-primary neutrix-text-primary-foreground hover:bg-primary/90',
        destructive:
          'neutrix-bg-destructive neutrix-text-destructive-foreground hover:bg-destructive/90',
        outline:
          'neutrix-border neutrix-border-input neutrix-bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'neutrix-bg-secondary neutrix-text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'neutrix-text-primary neutrix-underline-offset-4 hover:underline',
      },
      size: {
        default: 'neutrix-h-10 neutrix-px-4 neutrix-py-2',
        sm: 'neutrix-h-9 neutrix-rounded-xl neutrix-px-3',
        lg: 'neutrix-h-11 neutrix-rounded-xl neutrix-px-8',
        icon: 'neutrix-h-10 neutrix-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
