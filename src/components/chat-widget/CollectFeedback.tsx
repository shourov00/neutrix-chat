import React from 'react'
import { ChatMessage } from '@/models/chatModels'
import { useMutation } from '@tanstack/react-query'
import { updateChat } from '@/api'
import { Button } from '@/src/components/ui/button'
import { toast } from 'sonner'
import { useVisitor } from '@/hooks/useVisitor'
import { cn } from '@/lib/utils'

interface Props {
  message: ChatMessage
  isCloseChat: boolean
  handleCloseChat: (value: boolean) => void
}

const CollectFeedback = ({ message, handleCloseChat, isCloseChat }: Props) => {
  const [visitor, setVisitor] = useVisitor()
  const { mutate: handleChatFeedback } = useMutation({
    mutationFn: async (value: number) => {
      setVisitor({
        ...visitor,
        chatRating: value,
      })
      return (
        message?.chatId &&
        (await updateChat(message?.chatId, { rating: value }))
      )
    },
    onSuccess: () => {
      toast.success('Thanks for your feedback!')
      handleCloseChat(true)
    },
  })

  const ratings = [
    { id: 1, emoji: '😡' },
    { id: 2, emoji: '😦' },
    { id: 3, emoji: '🙂' },
    { id: 4, emoji: '😃' },
    { id: 5, emoji: '🤩' },
  ]

  return (
    <>
      <div className={'bg-primary p-4 rounded-lg text-white my-4'}>
        <div>How was your conversation with {message?.name}?</div>
        <div className={'flex gap-3 text-center justify-center mt-4'}>
          {ratings.map(({ id, emoji }) => (
            <span
              key={id}
              className={cn(
                'cursor-pointer text-4xl pt-[7px] p-1 w-[50px] h-[47px] flex items-center',
                visitor.chatRating === id && 'bg-[#1b2e4b] rounded-xl text-3xl',
              )}
              onClick={() => {
                if (visitor.chatRating > 0) {
                  toast.warning('Feedback already given')
                } else {
                  handleChatFeedback(id)
                }
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>

      {isCloseChat && (
        <div className={'text-sm text-center mb-2'}>
          Have anything else to say?
          <Button
            className={'underline'}
            variant={'link'}
            onClick={() => handleCloseChat(false)}
          >
            Reopen
          </Button>
        </div>
      )}
    </>
  )
}

export default CollectFeedback
