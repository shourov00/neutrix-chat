import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import React from 'react'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  reverseColor?: boolean
}

const AnnouncementDialog = ({ id, reverseColor }: Props) => {
  const { close } = useDialog()
  return (
    <>
      <DialogWrapper id={id}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          className={cn(
            'rounded-xl max-w-[250px] space-y-1',
            reverseColor && 'bg-primary text-white',
          )}
        >
          <img
            src={
              'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
            alt={'password'}
            className={'rounded-lg object-cover w-full h-[126px]'}
          />

          <DialogHeader>
            <DialogTitle>Hi, welcome to our website. </DialogTitle>
            <DialogDescription>This is an announcement.</DialogDescription>
          </DialogHeader>

          <Button
            className={cn(
              'w-full',
              reverseColor &&
                'bg-white text-primary hover:bg-white hover:text-primary',
            )}
            onClick={close}
          >
            Got it
          </Button>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default AnnouncementDialog
