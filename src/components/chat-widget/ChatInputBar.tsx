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
    setChatHeight(isEmoji ? 235 : 520)
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

      {files.length > 0 && (
        <div className={'flex flex-wrap gap-2 mb-1'}>
          {files.map((file) => (
            <div key={file.name} className={'relative'}>
              <img
                alt={file.name}
                src={URL.createObjectURL(file)}
                className={'w-14 h-14 object-cover rounded-lg border'}
              />
              <XIcon
                onClick={() =>
                  setFiles(files.filter((item) => item.name !== file.name))
                }
                className={
                  'w-4 h-4 text-red-400 cursor-pointer absolute right-[2px] top-[2px]'
                }
              />
            </div>
          ))}
        </div>
      )}

      <div className={'flex gap-2 items-end'}>
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
        <div
          className={cn('p-1 rounded-lg mx-auto', isEmoji && 'bg-secondary')}
        >
          <Smile
            className={'w-6 h-6 cursor-pointer hover:opacity-75'}
            onClick={() => setIsEmoji(!isEmoji)}
          />
        </div>
        <div className={'p-1 relative'}>
          <label htmlFor="file-upload">
            <ImageIcon className={'w-6 h-6 cursor-pointer hover:opacity-75'} />
          </label>
          <input
            id="file-upload"
            ref={fileInputRef}
            accept="image/*"
            name="files"
            type="file"
            multiple
            className={'absolute top-0 left-0 w-[30px] cursor-pointer hidden'}
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatInputBar
