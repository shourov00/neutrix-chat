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
import { Announcement } from '@/src/models/announcementModels'

interface Props {
  id: string
  reverseColor?: boolean
  announcement: Announcement
}

const AnnouncementStickerDialog = ({
  id,
  reverseColor,
  announcement,
}: Props) => {
  const { close } = useDialog()
  const display = announcement?.settings?.display
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
            src={display?.image?.url || ''}
            alt={display?.image?.name || ''}
            className={'rounded-t-lg object-cover w-full h-[160px]'}
          />

          <DialogHeader>
            <DialogTitle>{display?.title}</DialogTitle>
            <DialogDescription>{display?.content}</DialogDescription>
          </DialogHeader>

          <Button
            className={cn(
              'w-full',
              reverseColor &&
                'bg-white text-primary hover:bg-white hover:text-primary',
            )}
            onClick={() => {
              if (display?.actionButton?.action === 'dismiss') {
                close()
              }
            }}
          >
            {display?.actionButton?.dismissLabel}
          </Button>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default AnnouncementStickerDialog
