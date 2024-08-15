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
import {
  getDeviceType,
  handleAnnouncementResponse,
} from '@/utils/announcement.utils'
import { VisitorResponse } from '@/models/responseModels'

interface Props {
  id: string
  reverseColor?: boolean
  announcement: Announcement
  handleResponse: (response: VisitorResponse) => void
}

const AnnouncementStickerDialog = ({
  id,
  reverseColor,
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
        onClose={() => handleCompleteResponse('dismissed')}
      >
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
            className={'rounded-t-lg object-cover w-full h-[160px] rounded-lg'}
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
            onClick={() => handleCompleteResponse('completed')}
          >
            {display?.actionButton?.label ||
              display?.actionButton?.dismissLabel}
          </Button>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default AnnouncementStickerDialog
