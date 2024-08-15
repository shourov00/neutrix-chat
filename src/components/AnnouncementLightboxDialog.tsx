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
            'neutrix-rounded-lg neutrix-max-w-md neutrix-space-y-1 neutrix-left-[50%] neutrix-top-[50%] neutrix-translate-x-[-50%] neutrix-translate-y-[-50%] neutrix-p-0 neutrix-h-fit',
            display?.reversed && 'neutrix-bg-primary neutrix-text-white',
          )}
          overlay
          overlayClassName={
            display?.overlayState === 'dark'
              ? 'neutrix-bg-black/60'
              : 'neutrix-bg-white/60'
          }
          isClose={false}
        >
          <img
            src={display?.image?.url || ''}
            alt={display?.image?.name || ''}
            className={
              'neutrix-rounded-t-lg neutrix-object-cover neutrix-w-full neutrix-h-[160px]'
            }
          />

          <div
            className={
              'neutrix-pb-6 neutrix-px-6 neutrix-pt-2 neutrix-mx-auto neutrix-text-center'
            }
          >
            <DialogHeader>
              <DialogTitle
                className={
                  'neutrix-text-center neutrix-text-lg neutrix-font-bold'
                }
              >
                {display?.title}
              </DialogTitle>
              <DialogDescription className={'neutrix-text-center'}>
                {display?.content}
              </DialogDescription>
            </DialogHeader>

            {display?.actionButton?.action === 'dismiss' ? (
              <Button
                className={cn(
                  'neutrix-w-full',
                  display?.reversed &&
                    'neutrix-bg-white neutrix-text-primary hover:neutrix-bg-white hover:text-primary',
                )}
                onClick={() => handleCompleteResponse('dismissed')}
              >
                {display?.actionButton?.dismissLabel}
              </Button>
            ) : (
              <div className={'neutrix-flex neutrix-gap-2 neutrix-flex-col'}>
                <Button
                  className={cn(
                    'neutrix-w-full',
                    display?.reversed &&
                      'neutrix-bg-white neutrix-text-primary hover:neutrix-bg-white hover:neutrix-text-primary',
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
                    'neutrix-w-full neutrix-no-underline',
                    display?.reversed &&
                      'neutrix-bg-white neutrix-text-primary hover:neutrix-bg-white hover:neutrix-text-primary',
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
