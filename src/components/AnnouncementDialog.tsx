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

const AnnouncementDialog = ({ id }: { id: string }) => {
  const { close } = useDialog()
  return (
    <>
      <DialogWrapper id={id}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          className={'rounded-xl max-w-[250px] space-y-1'}
        >
          <img
            src={
              'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
            alt={'password'}
            className={'rounded-lg object-cover border w-full h-[126px]'}
          />

          <DialogHeader>
            <DialogTitle>Hi, welcome to our website. </DialogTitle>
            <DialogDescription>This is an announcement.</DialogDescription>
          </DialogHeader>

          <Button className={'w-full rounded-xl'} onClick={close}>
            Got it
          </Button>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default AnnouncementDialog
