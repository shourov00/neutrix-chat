import React from 'react'

import { ChatMessage } from '@/models/chatModels'
import { format } from 'date-fns'
import { Ban, CircleAlert, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import Loading from '@/src/components/ui/loading'

const SenderMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className={'flex items-end flex-col gap-2 mb-2'}>
      <div className={'flex gap-2 items-center'}>
        <div className={'font-bold text-sm'}>
          {message?.name || 'Anonymous'}
        </div>
        <div
          className={
            'rounded-full w-6 h-6 bg-primary text-white flex items-center justify-center'
          }
        >
          <UserRound className={'w-4 h-4'} />
        </div>
      </div>
      <div
        className={cn(
          'p-2 bg-[#ebf5ff] text-primary rounded-lg text-sm font-semibold break-all text-pretty flex flex-col',
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
                <img
                  key={index}
                  alt={attachment.url || attachment.file?.name}
                  src={
                    attachment.url ||
                    (attachment?.file && URL.createObjectURL(attachment.file))
                  }
                  className={cn(
                    'w-20 h-20 object-cover rounded-lg border',
                    message?.isError && 'opacity-50',
                  )}
                />
                {message?.isLoading && (
                  <div
                    className={
                      'absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'
                    }
                  >
                    <Loading />
                  </div>
                )}
                {message?.isError && (
                  <div
                    className={
                      'absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'
                    }
                  >
                    <CircleAlert className={'w-4 h-4 text-red-500'} />
                  </div>
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

export default SenderMessage
