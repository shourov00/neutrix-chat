import React from 'react'
import { ChatMessage } from '@/models/chatModels'
import { format } from 'date-fns'
import { CircleAlert, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import Loading from '@/src/components/ui/loading'

const SenderMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="neutrix-flex neutrix-items-end neutrix-flex-col neutrix-gap-2 neutrix-mb-2">
      <div className="neutrix-flex neutrix-gap-2 neutrix-items-center">
        <div className="neutrix-font-bold neutrix-text-sm">
          {message?.name || 'Anonymous'}
        </div>
        <div className="neutrix-rounded-full neutrix-w-6 neutrix-h-6 neutrix-bg-primary neutrix-text-white neutrix-flex neutrix-items-center neutrix-justify-center">
          <UserRound className="neutrix-w-4 neutrix-h-4" />
        </div>
      </div>
      <div
        className={cn(
          'neutrix-p-2 neutrix-bg-[#ebf5ff] neutrix-text-primary neutrix-rounded-lg neutrix-text-sm neutrix-font-semibold neutrix-break-all neutrix-text-pretty neutrix-flex neutrix-flex-col',
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
                <img
                  alt={attachment.url || attachment.file?.name}
                  src={
                    attachment.url ||
                    (attachment?.file && URL.createObjectURL(attachment.file))
                  }
                  className={cn(
                    'neutrix-w-20 neutrix-h-20 neutrix-object-cover neutrix-rounded-lg neutrix-border',
                    message?.isError && 'opacity-50',
                  )}
                />
                {message?.isLoading && (
                  <div className="neutrix-absolute neutrix-left-[50%] neutrix-top-[50%] neutrix-translate-x-[-50%] neutrix-translate-y-[-50%]">
                    <Loading />
                  </div>
                )}
                {message?.isError && (
                  <div className="neutrix-absolute neutrix-left-[50%] neutrix-top-[50%] neutrix-translate-x-[-50%] neutrix-translate-y-[-50%]">
                    <CircleAlert className="neutrix-w-4 neutrix-h-4 neutrix-text-red-500" />
                  </div>
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

export default SenderMessage
