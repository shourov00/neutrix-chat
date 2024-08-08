import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal, Smile } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import useAutosizeTextArea from '@/src/components/useAutosizeTextArea'
import { useVisitor } from '@/hooks/useVisitor'
import { getSiteIdAtom } from '@/hooks/siteIdStore'
import { ChatMessage } from '@/models/chatModels'
import { cn } from '@/lib/utils'

interface Props {
  onSendMessage: (message: ChatMessage) => void
  setChatHeight: (value: number) => void
}

const ChatInputBar = ({ onSendMessage, setChatHeight }: Props) => {
  const [visitor] = useVisitor()
  const [value, setValue] = useState('')
  const [isEmoji, setIsEmoji] = React.useState<boolean>(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useAutosizeTextArea(textAreaRef.current, value)

  useEffect(() => {
    setChatHeight(isEmoji ? 235 : 550)
  }, [isEmoji])

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value
    setValue(val)
  }

  const handleEmojiClick = (event: { emoji: string }) => {
    setValue((prevValue) => prevValue + event.emoji)
  }

  const handleSendMessage = () => {
    if (value.trim()) {
      onSendMessage({
        siteId: getSiteIdAtom(),
        status: 'sent',
        chatId: visitor.chatId,
        content: value,
        messageType: 'text',
        senderId: visitor.id,
        name: visitor.name,
        createdAt: new Date(),
      })
      setValue('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={'p-2 w-full shadow-t-md h-full pr-4'}>
      <EmojiPicker
        open={isEmoji}
        className={'mx-auto'}
        height={300}
        width={'100%'}
        style={{
          border: 'none',
          marginBottom: '20px',
        }}
        previewConfig={{
          showPreview: false,
        }}
        onEmojiClick={handleEmojiClick}
      />

      <div className={'flex gap-3 items-end'}>
        <Textarea
          className={
            'min-h-fit h-auto bg-transparent border-none font-semibold focus-visible:ring-0 focus-visible:ring-offset-0'
          }
          ref={textAreaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          placeholder={'Enter reply here...'}
          onKeyDown={handleKeyDown}
        />
        <Button
          size={'icon'}
          className={'min-w-8 h-8'}
          onClick={handleSendMessage}
        >
          <SendHorizonal className={'w-5 h-5'} />
        </Button>
        <div className={cn('p-1 rounded-lg', isEmoji && 'bg-secondary')}>
          <Smile
            className={'w-6 h-6 cursor-pointer hover:opacity-75'}
            onClick={() => setIsEmoji(!isEmoji)}
          />
        </div>
        <ImageIcon className={'w-8 h-8 cursor-pointer hover:opacity-75'} />
      </div>
    </div>
  )
}

export default ChatInputBar
