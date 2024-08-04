import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/src/components/ui/dialog'
import React from 'react'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'

interface Props {
  id: string
}

const ChatInviteDialog = ({ id }: Props) => {
  const { close } = useDialog()
  return (
    <>
      <DialogWrapper id={id} modal>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          className={'rounded-2xl max-w-[220px] space-y-1'}
        >
          <img
            src={
              'https://storage.googleapis.com/lucky-orange-public-uploads/ce8c9e46/5MDBl4kBGmLb4OTNNTBw'
            }
            alt={'neutrix'}
            className={
              'rounded-full object-cover w-8 h-8 absolute border border-white -left-[10px] -top-[10px]'
            }
          />

          <DialogHeader>
            <DialogDescription>hi</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default ChatInviteDialog
