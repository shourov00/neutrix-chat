import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal, Smile, XIcon } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import useAutosizeTextArea from '@/src/components/useAutosizeTextArea'
import { useVisitor } from '@/hooks/useVisitor'
import { getSiteIdAtom } from '@/hooks/siteIdStore'
import { ChatMessage } from '@/models/chatModels'
import { cn } from '@/lib/utils'
import { MAX_FILE_UPLOAD_SIZE } from '@/constants'
import { toast } from 'sonner'
import { useAddChatRoom } from '@/hooks/useAddChatRoom'

interface Props {
  onSendMessage: (message: ChatMessage) => void
  setChatHeight: (value: number) => void
}

const ChatInputBar = ({ onSendMessage, setChatHeight }: Props) => {
  const [files, setFiles] = useState<File[]>([])
  const [visitor] = useVisitor()
  const [value, setValue] = useState('')
  const [isEmoji, setIsEmoji] = React.useState<boolean>(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useAutosizeTextArea(textAreaRef.current, value)

  useEffect(() => {
    setChatHeight(isEmoji ? 235 : 510)
  }, [isEmoji])

  const { mutate: mutateNewChatRoom } = useAddChatRoom({ onSendMessage })

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value
    setValue(val)
  }

  const handleEmojiClick = (event: { emoji: string }) => {
    setValue((prevValue) => prevValue + event.emoji)
  }

  const handleSendMessage = () => {
    const newChatMessage: ChatMessage = {
      siteId: getSiteIdAtom(),
      status: 'sent',
      chatId: visitor.chatId,
      content: value,
      messageType: 'text',
      senderId: visitor.id,
      name: visitor.name,
      createdAt: new Date(),
      isLoading: !!files.length,
      attachments: files.map((file) => ({
        file,
        type: 'image',
      })),
    }

    if (value.trim() || files.length) {
      if (!visitor.chatId) {
        mutateNewChatRoom(newChatMessage)
      } else {
        onSendMessage(newChatMessage)
      }

      setValue('')
      setFiles([])
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const fileTypeCheck = (file: File) => {
    const exists = files.find((f) => f.name === file.name)
    if (exists) {
      toast.error('File already exists.')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please import a valid file.')
      return
    }
    if (file.size > MAX_FILE_UPLOAD_SIZE) {
      toast.error(`File ${file.name} exceeds the maximum size`)
      return
    }
    setFiles((prev) => [...prev, file])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const fileList = e.target.files
    if (fileList) {
      if (files.length + fileList.length > 5) {
        toast.error('You can only upload a maximum of 5 images.')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      for (const _file of fileList) {
        fileTypeCheck(_file)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div
      className={
        'neutrix-p-2 neutrix-w-full neutrix-shadow-t-md neutrix-h-full neutrix-pr-4'
      }
    >
      <EmojiPicker
        open={isEmoji}
        className={'neutrix-mx-auto'}
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

      {files.length > 0 && (
        <div
          className={
            'neutrix-flex neutrix-flex-wrap neutrix-gap-2 neutrix-mb-1'
          }
        >
          {files.map((file) => (
            <div key={file.name} className={'neutrix-relative'}>
              <img
                alt={file.name}
                src={URL.createObjectURL(file)}
                className={
                  'neutrix-w-14 neutrix-h-14 neutrix-object-cover neutrix-rounded-lg neutrix-border'
                }
              />
              <XIcon
                onClick={() =>
                  setFiles(files.filter((item) => item.name !== file.name))
                }
                className={
                  'neutrix-w-4 neutrix-h-4 neutrix-text-red-400 neutrix-cursor-pointer neutrix-absolute neutrix-right-[2px] neutrix-top-[2px]'
                }
              />
            </div>
          ))}
        </div>
      )}

      <div className={'neutrix-flex neutrix-gap-2 items-end'}>
        <Textarea
          className={
            'neutrix-min-h-fit neutrix-h-auto neutrix-bg-transparent neutrix-border-none neutrix-font-semibold neutrix-focus-visible:ring-0 neutrix-focus-visible:ring-offset-0'
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
          className={'neutrix-min-w-8 neutrix-h-8'}
          onClick={handleSendMessage}
        >
          <SendHorizonal className={'neutrix-w-5 neutrix-h-5'} />
        </Button>
        <div
          className={cn(
            'neutrix-p-1 neutrix-rounded-lg neutrix-mx-auto',
            isEmoji && 'neutrix-bg-secondary',
          )}
        >
          <Smile
            className={
              'neutrix-w-6 neutrix-h-6 neutrix-cursor-pointer hover:neutrix-opacity-75'
            }
            onClick={() => setIsEmoji(!isEmoji)}
          />
        </div>
        <div className={'p-1 relative'}>
          <label htmlFor="file-upload">
            <ImageIcon
              className={
                'neutrix-w-6 neutrix-h-6 neutrix-cursor-pointer hover:neutrix-opacity-75'
              }
            />
          </label>
          <input
            id="file-upload"
            ref={fileInputRef}
            accept="image/*"
            name="files"
            type="file"
            multiple
            className={
              'neutrix-absolute neutrix-top-0 neutrix-left-0 neutrix-w-[30px] neutrix-cursor-pointer neutrix-hidden'
            }
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatInputBar
