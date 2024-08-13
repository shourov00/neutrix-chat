import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import ChatIcon from '@/src/components/icons/ChatIcon'
import { MessageCircle, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import ChatInputBar from '@/src/components/chat-widget/ChatInputBar'
import ChatDetailsForm from '@/src/components/chat-widget/ChatDetailsForm'
import AwayFrom from '@/src/components/chat-widget/AwayFrom'
import {
  Attachment,
  ChatMessage,
  ChatSettings,
  CompanyInfo,
} from '@/models/chatModels'
import { useVisitor } from '@/hooks/useVisitor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getChatMessages, uploadFile } from '@/api'
import SenderMessage from '@/src/components/chat-widget/SenderMessage'
import { CHAT_MESSAGES } from '@/api/types'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import Loading from '@/src/components/ui/loading'
import ReceiverMessage from '@/src/components/chat-widget/ReceiverMessage'
import useWebSocket from '@/hooks/useWebSocket'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { getNameInitials } from '@/utils/visitor.utils'

interface Props {
  chatSettings: ChatSettings
  companyInfo: CompanyInfo
}

const ChatWidget = ({ chatSettings, companyInfo }: Props) => {
  const [visitor] = useVisitor()
  const [open, setOpen] = useState<boolean>(false)
  const [isAccent] = useState<boolean>(
    chatSettings?.chat?.introduction?.backgroundColor === 'accentColor',
  )
  const [isRequirePreQualification] = useState(
    chatSettings?.chat?.messaging?.preQualificationActive,
  )
  const [isAwayFrom, setIsAwayFrom] = useState<boolean>(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatHeight, setChatHeight] = useState<number>(520)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isChatPositionLeft = chatSettings?.chat?.launcher?.position === 'left'

  const { data: previousChats, isLoading } = useChatMessages(
    visitor.chatId,
    1,
    visitor.id,
  )

  const { mutate: fileUploadMutate } = useMutation({
    mutationFn: async (values: ChatMessage) => {
      const formData = new FormData()
      if (values?.attachments) {
        for (const attachment of values.attachments) {
          if (attachment.file) {
            formData.append('images', attachment.file)
          }
        }
      }
      return await uploadFile(formData)
    },
    onSuccess: (data, values) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.createdAt === values.createdAt
            ? { ...msg, isLoading: false }
            : msg,
        ),
      )

      const message = values
      message.attachments = data.data.data.map(
        (image: string): Attachment => ({
          type: 'image',
          url: image,
        }),
      )

      sendMessage({
        action: 'setName',
        role: 'visitor',
        ...message,
      })
    },
    onError: (error, values) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.createdAt === values.createdAt
            ? { ...msg, isLoading: false, isError: true }
            : msg,
        ),
      )
      toast.error(error?.message)
    },
  })

  useEffect(() => {
    if (previousChats && !isLoading) {
      setMessages(previousChats?.data || [])
    }
  }, [previousChats])

  const handleNewMessage = (data: any) => {
    setMessages((prev) => [...prev, data])
  }

  const { connect, sendMessage } = useWebSocket({
    onMessage: handleNewMessage,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
  })

  const onSendMessage = useCallback(
    (chatMessage: ChatMessage) => {
      if (chatMessage?.attachments) {
        fileUploadMutate(chatMessage)
      } else {
        sendMessage({
          action: 'setName',
          role: 'visitor',
          ...chatMessage,
        })
      }
      setMessages((prev) => [...prev, chatMessage])
    },
    [sendMessage, fileUploadMutate],
  )

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 0) // Delay to ensure DOM updates

      return () => clearTimeout(timer)
    }
  }, [open, messages])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        {chatSettings?.chat?.launcher?.launcherType === 'default' ? (
          <Button
            className={cn(
              'p-[12px] bottom-0 right-0 fixed mb-4 bg-white transition-all hover:bg-white h-14 w-14 rounded-2xl drop-shadow-lg hover:drop-shadow-xl',
              isChatPositionLeft && 'left-0',
            )}
            style={{
              marginLeft: isChatPositionLeft
                ? chatSettings?.chat?.launcher?.padding.left
                : 0,
              marginRight: !isChatPositionLeft
                ? chatSettings?.chat?.launcher?.padding.right
                : 0,
              marginBottom:
                chatSettings?.chat?.launcher?.launcherType === 'default'
                  ? chatSettings?.chat?.launcher?.padding.bottom
                  : 0,
            }}
            onClick={connect}
          >
            <ChatIcon
              fillColor1={chatSettings?.chat?.accentColor}
              fillColor2={chatSettings?.chat?.accentColor}
            />
          </Button>
        ) : (
          <Button
            className={cn(
              'p-3 rounded-md font-bold bottom-0 right-0 fixed mb-0 mr-4 bg-white transition-all hover:bg-white text-primary drop-shadow-lg hover:drop-shadow-xl text-xs',
              isChatPositionLeft && 'left-0',
            )}
            style={{
              marginLeft: isChatPositionLeft
                ? chatSettings?.chat?.launcher?.padding.left
                : 0,
              marginRight: !isChatPositionLeft
                ? chatSettings?.chat?.launcher?.padding.right
                : 0,
            }}
            onClick={connect}
          >
            <MessageCircle
              className={'w-4 h-4 me-2'}
              color={chatSettings?.chat?.accentColor}
              fill={chatSettings?.chat?.accentColor}
            />
            {chatSettings?.chat?.launcher?.miniChatLabel || 'Chat'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        animationClassName={'data-[state=closed]:animate-slideInDown'}
        className={cn(
          'sm:max-w-[400px] bottom-0 right-0 p-0 gap-0',
          isChatPositionLeft && 'left-0',
        )}
        style={{
          marginLeft: isChatPositionLeft
            ? chatSettings?.chat?.launcher?.padding.left
            : 0,
          marginRight: !isChatPositionLeft
            ? chatSettings?.chat?.launcher?.padding.right
            : 0,
          marginBottom:
            chatSettings?.chat?.launcher?.launcherType === 'default'
              ? chatSettings?.chat?.launcher?.padding.bottom
              : 0,
        }}
        isClose={false}
      >
        <DialogHeader
          className={cn(
            'bg-secondary rounded-t-xl p-4 flex-row flex items-center gap-4 relative space-y-0',
            isAccent && 'bg-primary',
          )}
        >
          <Avatar>
            <AvatarImage
              className={'rounded-full object-cover w-8 h-8 shadow-xl'}
              src={
                chatSettings?.chat?.introduction?.headerImage === 'companyIcon'
                  ? companyInfo?.companyImage
                  : companyInfo?.image
              }
            />
            <AvatarFallback
              className={
                'bg-[#fbf6c6] font-bold text-sm border rounded-full border-white p-2'
              }
            >
              {getNameInitials(companyInfo?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle
              className={cn(
                'text-lg font-bold text-primary',
                isAccent && 'text-white',
              )}
            >
              {chatSettings?.chat?.introduction?.companyTitle}
            </DialogTitle>
            {/*<DialogDescription*/}
            {/*  className={cn(*/}
            {/*    'text-xs text-primary font-light',*/}
            {/*    isAccent && 'text-secondary',*/}
            {/*  )}*/}
            {/*>*/}
            {/*  Representative*/}
            {/*</DialogDescription>*/}
          </div>

          {isLoading && (
            <Loading className={'text-white absolute right-1 bottom-2'} />
          )}

          <Button
            size={'icon'}
            className={cn(
              'absolute right-1 top-0 hover:opacity-75 bg-transparent hover:bg-transparent text-primary',
              isAccent && 'text-white',
            )}
            onClick={() => setOpen(false)}
          >
            <Minus className={'w-6 h-6'} />{' '}
          </Button>
        </DialogHeader>
        <ScrollArea className="w-full" style={{ height: `${chatHeight}px` }}>
          <div className={'p-5 flex flex-col gap-5'} ref={chatContainerRef}>
            {messages.map((message: ChatMessage) =>
              message?.senderId === visitor.id ? (
                <SenderMessage
                  key={message?.createdAt?.toString()}
                  message={message}
                />
              ) : (
                <ReceiverMessage
                  key={message?.createdAt?.toString()}
                  message={message}
                />
              ),
            )}

            {messages?.length === 1 && (
              <div
                className={
                  'text-sm font-semibold bg-secondary p-4 rounded-md text-primary/75'
                }
              >
                {chatSettings?.chat?.messaging?.waiting}
              </div>
            )}

            {isAwayFrom ? (
              <AwayFrom
                onSendMessage={onSendMessage}
                chatSettings={chatSettings}
              />
            ) : (
              !messages.length && (
                <>
                  <div
                    className={cn(
                      'text-sm font-semibold',
                      !isRequirePreQualification &&
                        'bg-secondary p-4 rounded-md my-6',
                    )}
                  >
                    {chatSettings?.chat?.messaging?.message}
                  </div>

                  {isRequirePreQualification && (
                    <ChatDetailsForm
                      onSendMessage={onSendMessage}
                      type={'pre-qualification'}
                      messageForm={chatSettings?.chat?.messaging}
                    />
                  )}
                </>
              )
            )}
          </div>
        </ScrollArea>

        {!isRequirePreQualification && !isAwayFrom && (
          <ChatInputBar
            onSendMessage={onSendMessage}
            setChatHeight={setChatHeight}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

const useChatMessages = (chatId: string, page: number, visitorId: string) =>
  useQuery({
    queryKey: [CHAT_MESSAGES],
    queryFn: () =>
      getChatMessages(chatId, {
        visitorId,
        page,
      }).then((res) => res.data.data),
  })

export default ChatWidget
