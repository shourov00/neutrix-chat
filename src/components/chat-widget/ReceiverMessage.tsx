import React from 'react'
import { ChatMessage } from '@/models/chatModels'
import { format } from 'date-fns'
import { UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const ReceiverMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="neutrix-flex items-start neutrix-flex-col neutrix-gap-2 neutrix-mb-2">
      <div className="neutrix-flex neutrix-gap-2 neutrix-items-center">
        <div className="neutrix-rounded-full neutrix-w-6 neutrix-h-6 neutrix-bg-primary neutrix-text-white neutrix-flex neutrix-items-center neutrix-justify-center">
          <UserRound className="neutrix-w-4 neutrix-h-4" />
        </div>
        <div className="neutrix-font-bold neutrix-text-sm">
          {message?.name || 'Anonymous'}
        </div>
      </div>
      <div
        className={cn(
          'neutrix-p-2 neutrix-bg-[#f3f4f6] neutrix-text-primary neutrix-rounded-lg neutrix-text-sm neutrix-font-semibold neutrix-break-all neutrix-text-pretty neutrix-flex neutrix-flex-col',
          !message.attachments?.length &&
            message.content &&
            message.content.length <= 40 &&
            'neutrix-flex-row neutrix-gap-2',
        )}
      >
        <span className="neutrix-break-all">{message.content}</span>

        {message.attachments && (
          <div className="neutrix-flex neutrix-flex-wrap neutrix-gap-2 neutrix-my-1 neutrix-ms-auto">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="neutrix-relative">
                {attachment.url && (
                  <img
                    alt={attachment.url}
                    src={attachment.url}
                    className="neutrix-w-20 neutrix-h-20 neutrix-object-cover neutrix-rounded-lg neutrix-border"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="neutrix-font-light neutrix-text-[11px] neutrix-text-right neutrix-mt-auto">
          {format(message?.createdAt || new Date(), 'hh:mm a')}
        </div>
      </div>
    </div>
  )
}

export default ReceiverMessage
