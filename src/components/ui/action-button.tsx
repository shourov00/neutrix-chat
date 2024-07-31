import { Button, ButtonProps } from '@/src/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/src/components/ui/checkbox'

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
        <Checkbox
          checked={isChecked}
          onClick={props.onClick}
          className={'me-2'}
        />
      )}
      {title}
    </Button>
  )
}

export default ActionButton
