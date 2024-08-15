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
      <div
        className={
          'neutrix-bg-primary neutrix-p-4 neutrix-rounded-lg neutrix-text-white neutrix-my-4'
        }
      >
        <div>How was your conversation with {message?.name}?</div>
        <div
          className={
            'neutrix-flex neutrix-gap-3 neutrix-text-center neutrix-justify-center neutrix-mt-4'
          }
        >
          {ratings.map(({ id, emoji }) => (
            <span
              key={id}
              className={cn(
                'neutrix-cursor-pointer neutrix-text-4xl neutrix-pt-[7px] neutrix-p-1 neutrix-w-[50px] neutrix-h-[47px] neutrix-flex neutrix-items-center',
                visitor.chatRating === id &&
                  'neutrix-bg-[#1b2e4b] neutrix-rounded-xl neutrix-text-3xl',
                'neutrix-ms-auto',
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
        <div className={'neutrix-text-sm neutrix-text-center neutrix-mb-2'}>
          Have anything else to say?
          <Button
            className={'neutrix-underline'}
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
