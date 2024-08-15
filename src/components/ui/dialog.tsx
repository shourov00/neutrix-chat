import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'neutrix-fixed neutrix-inset-0 neutrix-z-50 neutrix-bg-black/80 data-[state=open]:neutrix-animate-in data-[state=closed]:neutrix-animate-out data-[state=closed]:neutrix-fade-out-0 data-[state=open]:neutrix-fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    overlay?: boolean
    overlayClassName?: string
    animationClassName?: string
    isClose?: boolean
  }
>(
  (
    {
      className,
      children,
      overlay = false,
      isClose = true,
      overlayClassName,
      animationClassName,
      ...props
    },
    ref,
  ) => (
    <DialogPortal>
      {overlay && <DialogOverlay className={overlayClassName} />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          `neutrix-shadow-xl neutrix-outline-none neutrix-group neutrix-p-4 neutrix-fixed neutrix-bottom-[20px] neutrix-right-[20px] neutrix-z-[10000] neutrix-grid neutrix-w-full neutrix-max-w-lg neutrix-gap-4 neutrix-bg-background neutrix-duration-200 ${animationClassName || 'neutrix-shadow-xl neutrix-outline-none neutrix-group neutrix-p-4 neutrix-fixed neutrix-bottom-[20px] neutrix-right-[20px] neutrix-z-[10000] neutrix-grid neutrix-w-full neutrix-max-w-lg neutrix-gap-4 neutrix-bg-background neutrix-duration-200 data-[state=open]:neutrix-animate-in data-[state=closed]:neutrix-animate-out data-[state=closed]:neutrix-fade-out-0 data-[state=open]:neutrix-fade-in-0 data-[state=closed]:neutrix-zoom-out-95 data-[state=open]:neutrix-zoom-in-95 data-[state=closed]:neutrix-slide-out-to-left-1/2 data-[state=closed]:neutrix-slide-out-to-top-[48%] data-[state=open]:neutrix-slide-in-from-left-1/2 data-[state=open]:neutrix-slide-in-from-top-[48%]'} neutrix-rounded-xl`,
          className,
        )}
        {...props}
      >
        {children}
        {isClose && (
          <DialogPrimitive.Close className="neutrix-text-primary neutrix-invisible group-hover:neutrix-visible neutrix-transition-all neutrix-bg-background neutrix-rounded-xl neutrix-shadow-md neutrix-p-1.5 neutrix-absolute -neutrix-right-2 -neutrix-top-4 neutrix-opacity-70 neutrix-ring-offset-background hover:neutrix-opacity-100 neutrix-focus:outline-neutrix-focus:ring-2 neutrix-focus:ring-ring neutrix-focus:ring-offset-2 neutrix-disabled:pointer-events-none data-[state=open]:neutrix-bg-accent data-[state=open]:neutrix-text-muted-foreground">
            <X className="neutrix-h-5 neutrix-w-5" />
            <span className="neutrix-sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'neutrix-flex neutrix-flex-col neutrix-space-y-2 neutrix-text-center sm:neutrix-text-left',
      className,
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'neutrix-flex neutrix-flex-col-reverse sm:neutrix-flex-row sm:neutrix-justify-end sm:neutrix-space-x-2',
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'neutrix-text-base neutrix-font-semibold neutrix-leading-none neutrix-tracking-tight',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('neutrix-text-sm neutrix-text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
