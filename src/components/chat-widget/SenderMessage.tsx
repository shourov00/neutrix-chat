import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'

import { ChatMessage } from '@/src/models/chatModels'
import { format } from 'date-fns'

const SenderMessage = ({ message }: { message: ChatMessage }) => {
  return (
    <div className={'flex items-end flex-col gap-2 mb-4'}>
      <div className={'flex gap-2'}>
        <div className={'font-bold text-sm'}>User name</div>
        <div className={'font-light text-sm'}>
          {format(message?.createdAt || new Date(), 'HH:mm')}
        </div>
        <Avatar className={'w-6 h-6'}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div
        className={
          'p-2 bg-[#ebf5ff] text-primary rounded-lg text-sm font-semibold'
        }
      >
        {message.content}
      </div>
    </div>
  )
}

export default SenderMessage
