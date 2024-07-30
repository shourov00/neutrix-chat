import { Button, ButtonProps } from '@/src/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'

interface props extends ButtonProps {
  title: string
}

const ActionButton = ({ title, className, ...props }: props) => {
  return (
    <Button
      variant={'ghost'}
      className={cn(
        'rounded-xl w-fit bg-white shadow-md hover:shadow-lg hover:bg-white transition-all font-bold',
        className,
      )}
      {...props}
    >
      {title}
    </Button>
  )
}

export default ActionButton
