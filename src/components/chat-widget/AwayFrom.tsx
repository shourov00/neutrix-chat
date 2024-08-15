import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Clock5 } from 'lucide-react'
import { ChatMessage, ChatSettings } from '@/models/chatModels'
import ChatDetailsForm from '@/src/components/chat-widget/ChatDetailsForm'
import { getOfficeHours } from '@/utils/date.utils'

interface Props {
  onSendMessage: (message: ChatMessage) => void
  chatSettings?: ChatSettings
}

const AwayFrom = ({ onSendMessage, chatSettings }: Props) => {
  const [showThanks, setShowThanks] = useState(false)

  return (
    <>
      {showThanks ? (
        <div
          className={
            'neutrix-text-sm neutrix-font-semibold neutrix-bg-secondary neutrix-p-4 neutrix-rounded-md neutrix-text-primary/75 neutrix-mt-6'
          }
        >
          {chatSettings?.chat?.awayMessage?.thankYou}
        </div>
      ) : (
        <>
          {chatSettings?.chat?.awayMessage?.displayOfficeHours && (
            <div
              className={
                'neutrix-p-4 neutrix-w-full neutrix-rounded-md neutrix-font-bold neutrix-flex neutrix-gap-1 neutrix-text-xs neutrix-items-center neutrix-justify-center neutrix-border'
              }
            >
              <Clock5 className={'neutrix-w-4 neutrix-h-4'} />
              {getOfficeHours(chatSettings?.chat?.advanced) ? (
                <span>
                  Usually online from{' '}
                  {getOfficeHours(chatSettings?.chat?.advanced)}
                </span>
              ) : (
                <span>We are currently not available.</span>
              )}
            </div>
          )}

          <div className={cn('neutrix-text-sm neutrix-font-semibold')}>
            {chatSettings?.chat?.awayMessage?.message}
          </div>

          <ChatDetailsForm
            type={'away'}
            onSendMessage={onSendMessage}
            messageForm={chatSettings?.chat?.awayMessage}
            setShowThanks={setShowThanks}
          />
        </>
      )}
    </>
  )
}

export default AwayFrom
