import { Button, ButtonProps } from '@/src/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'

interface props extends ButtonProps {
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
}: props) => {
  return (
    <Button
      variant={'ghost'}
      className={cn(
        'w-fit bg-white shadow-md hover:shadow-lg hover:bg-white transition-all font-bold',
        className,
        isChecked && 'bg-primary hover:bg-primary text-white hover:text-white',
      )}
      {...props}
    >
      {isCheckBox && (
        <div
          className={cn(
            'w-4 h-4 border border-primary rounded mr-2',
            isChecked && 'bg-primary',
          )}
        >
          {isChecked && <CheckIcon className={'w-3.5 h-3.5'} />}
        </div>
      )}
      {title}
    </Button>
  )
}

export default ActionButton
