import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Clock5 } from 'lucide-react'
import { ChatMessage } from '@/models/chatModels'
import ChatDetailsForm from '@/src/components/chat-widget/ChatDetailsForm'

interface Props {
  onSendMessage: (message: ChatMessage) => void
}

const AwayFrom = ({ onSendMessage }: Props) => {
  const [displayOfficeHours, setDisplayOfficeHours] = useState(true)

  return (
    <>
      {displayOfficeHours && (
        <div
          className={
            'p-4 w-full rounded-md font-bold flex gap-1 text-xs items-center justify-center border'
          }
        >
          <Clock5 className={'w-4 h-4'} />
          <span>Back online from 7PM - 4AM</span>
        </div>
      )}

      <div className={cn('text-sm font-semibold')}>
        Hello there. Our team is currently offline. Please leave your email and
        send us a message. We usually reply within a couple hours
      </div>

      <ChatDetailsForm type={'away'} onSendMessage={onSendMessage} />
    </>
  )
}

export default AwayFrom
