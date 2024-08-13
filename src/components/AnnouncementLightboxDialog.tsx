import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import React, { useEffect, useState } from 'react'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'
import { Announcement } from '@/models/announcementModels'
import { VisitorResponse } from '@/models/responseModels'
import {
  getDeviceType,
  handleAnnouncementResponse,
} from '@/utils/announcement.utils'

interface Props {
  id: string
  announcement: Announcement
  handleResponse: (response: VisitorResponse) => void
}

const AnnouncementLightboxDialog = ({
  id,
  announcement,
  handleResponse,
}: Props) => {
  const { close, currentDialog } = useDialog()
  const display = announcement?.settings?.display
  const [startTime, setStartTime] = React.useState<number>(0)
  const [deviceType] = useState<'desktop' | 'mobile' | 'tablet'>(
    getDeviceType(),
  )

  useEffect(() => {
    if (currentDialog === id) {
      setStartTime(Date.now())
      const response = handleAnnouncementResponse({
        status: 'viewed',
        announcement,
        devices: [
          {
            id: deviceType,
            name: deviceType,
            responseTime: startTime,
          },
        ],
      })
      handleResponse(response)
    }
  }, [currentDialog])

  const handleCompleteResponse = (
    status: 'viewed' | 'completed' | 'dismissed',
  ) => {
    const responseTime = Date.now() - startTime
    const response = handleAnnouncementResponse({
      status,
      announcement,
      devices: [
        {
          id: deviceType,
          name: deviceType,
          responseTime: responseTime,
        },
      ],
    })
    handleResponse(response)
    close()
  }

  return (
    <>
      <DialogWrapper
        id={id}
        modal
        onClose={() => handleCompleteResponse('dismissed')}
      >
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
                onClick={() => handleCompleteResponse('dismissed')}
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
                  onClick={() => handleCompleteResponse('completed')}
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
                  onClick={() => handleCompleteResponse('dismissed')}
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
