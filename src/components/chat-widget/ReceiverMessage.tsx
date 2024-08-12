import React from 'react'

import { ChatMessage } from '@/models/chatModels'
import { format } from 'date-fns'
import { UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const ReceiverMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className={'flex items-start flex-col gap-2 mb-2'}>
      <div className={'flex gap-2 items-center'}>
        <div
          className={
            'rounded-full w-6 h-6 bg-primary text-white flex items-center justify-center'
          }
        >
          <UserRound className={'w-4 h-4'} />
        </div>
        <div className={'font-bold text-sm'}>
          {message?.name || 'Anonymous'}
        </div>
      </div>
      <div
        className={cn(
          'p-2 bg-[#f3f4f6] text-primary rounded-lg text-sm font-semibold break-all text-pretty flex flex-col',
          !message.attachments?.length &&
            message.content &&
            message.content.length <= 40 &&
            'flex-row gap-2',
        )}
      >
        <span className="break-all">{message.content}</span>

        {message.attachments && (
          <div className={'flex flex-wrap gap-2 my-1 ms-auto'}>
            {message.attachments.map((attachment, index) => (
              <div className={'relative'}>
                {attachment.url && (
                  <img
                    key={index}
                    alt={attachment.url}
                    src={attachment.url}
                    className={'w-20 h-20 object-cover rounded-lg border'}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="font-light text-[11px] text-right mt-auto">
          {format(message?.createdAt || new Date(), 'hh:mm a')}
        </div>
      </div>
    </div>
  )
}

export default ReceiverMessage
