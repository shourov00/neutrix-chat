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
            'text-sm font-semibold bg-secondary p-4 rounded-md text-primary/75 mt-6'
          }
        >
          {chatSettings?.chat?.awayMessage?.thankYou}
        </div>
      ) : (
        <>
          {chatSettings?.chat?.awayMessage?.displayOfficeHours && (
            <div
              className={
                'p-4 w-full rounded-md font-bold flex gap-1 text-xs items-center justify-center border'
              }
            >
              <Clock5 className={'w-4 h-4'} />
              {getOfficeHours(chatSettings?.chat?.advanced) ? (
                <span>
                  Usually online from{' '}
                  {getOfficeHours(chatSettings?.chat?.advanced)}
                </span>
              ) : (
                <span>Out of office</span>
              )}
            </div>
          )}

          <div className={cn('text-sm font-semibold')}>
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
