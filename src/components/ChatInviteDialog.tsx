import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/src/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'
import { VisitorResponse } from '@/models/responseModels'
import { ChatInvite } from '@/models/chatInviteModels'
import { handleChatInviteResponse } from '@/utils/chatInvites.utils'
import { getDeviceType } from '@/utils/announcement.utils'
import { CompanyInfo } from '@/models/chatModels'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { getNameInitials } from '@/utils/visitor.utils'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  reverseColor?: boolean
  chatInvite: ChatInvite
  companyInfo: CompanyInfo
  handleResponse: (response: VisitorResponse) => void
}

const ChatInviteDialog = ({
  id,
  chatInvite,
  handleResponse,
  companyInfo,
}: Props) => {
  const { close, currentDialog } = useDialog()
  const [startTime, setStartTime] = React.useState<number>(0)
  const [deviceType] = useState<'desktop' | 'mobile' | 'tablet'>(
    getDeviceType(),
  )

  useEffect(() => {
    if (currentDialog === id) {
      setStartTime(Date.now())
      const response = handleChatInviteResponse({
        status: 'viewed',
        chatInvite,
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
    const response = handleChatInviteResponse({
      status,
      chatInvite,
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
          className={
            'neutrix-rounded-2xl neutrix-max-w-[220px] neutrix-space-y-1'
          }
        >
          {chatInvite?.settings?.icon?.iconType !== 'none' && (
            <Avatar>
              <AvatarImage
                className={
                  'neutrix-rounded-full neutrix-object-cover neutrix-w-8 neutrix-h-8 neutrix-absolute neutrix-border neutrix-border-white -neutrix-left-[10px] -neutrix-top-[10px]'
                }
                src={
                  chatInvite?.settings?.icon?.iconType === 'company'
                    ? companyInfo?.companyImage
                    : companyInfo?.image
                }
              />
              <AvatarFallback
                className={
                  'neutrix-absolute -neutrix-left-[10px] -neutrix-top-[10px] neutrix-bg-[#fbf6c6] neutrix-font-bold neutrix-text-sm neutrix-border neutrix-rounded-full neutrix-border-white neutrix-p-2'
                }
              >
                {getNameInitials(companyInfo?.fullName)}
              </AvatarFallback>
            </Avatar>
          )}

          <DialogHeader>
            <DialogDescription
              className={cn(
                !chatInvite?.settings?.displayFullMessage &&
                  'neutrix-line-clamp-3',
              )}
            >
              {chatInvite?.settings?.message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default ChatInviteDialog
