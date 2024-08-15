import React from 'react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'light'}
      className="toaster neutrix-group"
      toastOptions={{
        classNames: {
          toast:
            'neutrix-group toast neutrix-group-[.toaster]:neutrix-bg-background neutrix-group-[.toaster]:neutrix-text-foreground neutrix-group-[.toaster]:neutrix-border-border neutrix-group-[.toaster]:neutrix-shadow-lg',
          description: 'neutrix-group-[.toast]:neutrix-text-muted-foreground',
          actionButton:
            'neutrix-group-[.toast]:neutrix-bg-primary neutrix-group-[.toast]:neutrix-text-primary-foreground',
          cancelButton:
            'neutrix-group-[.toast]:neutrix-bg-muted neutrix-group-[.toast]:neutrix-text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
