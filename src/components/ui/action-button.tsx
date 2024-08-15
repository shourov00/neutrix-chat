import { Button, ButtonProps } from '@/src/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'

interface Props extends ButtonProps {
  title: string
  isCheckBox?: boolean
  isChecked?: boolean
}

const ActionButton = ({
  title,
  className,
  isChecked,
  isCheckBox,
  ...props
}: Props) => {
  return (
    <Button
      variant={'ghost'}
      className={cn(
        'neutrix-w-fit neutrix-bg-white neutrix-shadow-md hover:shadow-lg hover:neutrix-bg-white neutrix-transition-all neutrix-font-bold',
        className,
        isChecked &&
          'neutrix-bg-primary hover:neutrix-bg-primary neutrix-text-white hover:text-white',
      )}
      {...props}
    >
      {isCheckBox && (
        <div
          className={cn(
            'neutrix-w-4 neutrix-h-4 neutrix-border neutrix-border-primary neutrix-rounded neutrix-mr-2',
            isChecked && 'neutrix-bg-primary',
          )}
        >
          {isChecked && <CheckIcon className={'neutrix-w-3.5 neutrix-h-3.5'} />}
        </div>
      )}
      {title}
    </Button>
  )
}

export default ActionButton
