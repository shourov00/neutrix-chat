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
  announcement: Announcement
}

const AnnouncementLightboxDialog = ({ id, announcement }: Props) => {
  const { close } = useDialog()
  const display = announcement?.settings?.display
  return (
    <>
      <DialogWrapper id={id} modal>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          className={cn(
            'rounded-lg max-w-md space-y-1 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-0 h-fit',
            display?.reversed && 'bg-primary text-white',
          )}
          overlay
          overlayClassName={
            display?.overlayState === 'dark' ? 'bg-black/60' : 'bg-white/60'
          }
          isClose={false}
        >
          <img
            src={display?.image?.url || ''}
            alt={display?.image?.name || ''}
            className={'rounded-t-lg object-cover w-full h-[160px]'}
          />

          <div className={'pb-6 px-6 pt-2 mx-auto text-center'}>
            <DialogHeader>
              <DialogTitle className={'text-center text-lg font-bold'}>
                {display?.title}
              </DialogTitle>
              <DialogDescription className={'text-center'}>
                {display?.content}
              </DialogDescription>
            </DialogHeader>

            {display?.actionButton?.action === 'dismiss' ? (
              <Button
                className={cn(
                  'w-full',
                  display?.reversed &&
                    'bg-white text-primary hover:bg-white hover:text-primary',
                )}
                onClick={close}
              >
                {display?.actionButton?.dismissLabel}
              </Button>
            ) : (
              <div className={'flex gap-2 flex-col'}>
                <Button
                  className={cn(
                    'w-full',
                    display?.reversed &&
                      'bg-white text-primary hover:bg-white hover:text-primary',
                  )}
                  asChild
                >
                  <a href={display?.actionButton?.url || '/'} target="_blank">
                    {display?.actionButton?.urlLabel}
                  </a>
                </Button>

                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full no-underline',
                    display?.reversed &&
                      'bg-white text-primary hover:bg-white hover:text-primary',
                  )}
                >
                  {display?.dismissButton?.label}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default AnnouncementLightboxDialog
