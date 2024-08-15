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
import CollectFeedback from '@/src/components/chat-widget/CollectFeedback'

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
  const [isAwayFrom] = useState<boolean>(
    // showChatAwayForm(chatSettings?.chat?.advanced),
    false,
  )
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatHeight, setChatHeight] = useState<number>(510)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isCloseChat, setIsCloseChat] = useState(false)
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
      if (
        previousChats?.data[previousChats?.data.length - 1]?.status === 'close'
      ) {
        setIsCloseChat(true)
      }
    }
  }, [previousChats])

  const handleNewMessage = (data: any) => {
    if (data?.status === 'close') {
      setIsCloseChat(true)
    }
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
              'neutrix-p-[12px] neutrix-bottom-0 neutrix-right-0 neutrix-fixed neutrix-mb-4 neutrix-bg-white neutrix-transition-all hover:neutrix-bg-white neutrix-h-14 neutrix-w-14 neutrix-rounded-2xl neutrix-drop-shadow-lg hover:neutrix-drop-shadow-xl',
              isChatPositionLeft && 'neutrix-left-0',
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
              'neutrix-p-3 neutrix-rounded-md neutrix-font-bold neutrix-bottom-0 neutrix-right-0 neutrix-fixed neutrix-mb-0 neutrix-mr-4 neutrix-bg-white neutrix-transition-all hover:neutrix-bg-white neutrix-text-primary neutrix-drop-shadow-lg hover:neutrix-drop-shadow-xl neutrix-text-xs',
              isChatPositionLeft && 'neutrix-left-0',
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
              className={'neutrix-w-4 neutrix-h-4 neutrix-me-2'}
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
        animationClassName={'data-[state=closed]:neutrix-animate-slideInDown'}
        className={cn(
          'neutrix-w-fit sm:neutrix-max-w-[400px] neutrix-bottom-0 neutrix-right-0 neutrix-p-0 neutrix-gap-0',
          isChatPositionLeft && 'neutrix-left-0',
        )}
        style={{
          marginLeft: isChatPositionLeft
            ? chatSettings?.chat?.launcher?.padding.left
            : 20,
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
            'neutrix-bg-secondary neutrix-rounded-t-xl neutrix-p-4 neutrix-flex-row neutrix-flex neutrix-items-center neutrix-gap-4 neutrix-relative neutrix-space-y-0',
            isAccent && 'neutrix-bg-primary',
          )}
        >
          <Avatar>
            <AvatarImage
              className={
                'neutrix-rounded-full neutrix-object-cover neutrix-w-8 neutrix-h-8 neutrix-shadow-xl'
              }
              src={
                chatSettings?.chat?.introduction?.headerImage === 'companyIcon'
                  ? companyInfo?.companyImage
                  : companyInfo?.image
              }
            />
            <AvatarFallback
              className={
                'neutrix-bg-[#fbf6c6] neutrix-font-bold neutrix-text-sm neutrix-border neutrix-rounded-full neutrix-border-white neutrix-p-2'
              }
            >
              {getNameInitials(companyInfo?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle
              className={cn(
                'neutrix-text-lg neutrix-font-bold neutrix-text-primary',
                isAccent && 'neutrix-text-white',
              )}
            >
              {chatSettings?.chat?.introduction?.companyTitle}
            </DialogTitle>
            {/*<DialogDescription*/}
            {/*  className={cn(*/}
            {/*    'neutrix-text-xs neutrix-text-primary neutrix-font-light',*/}
            {/*    isAccent && 'neutrix-text-secondary',*/}
            {/*  )}*/}
            {/*>*/}
            {/*  Representative*/}
            {/*</DialogDescription>*/}
          </div>

          {isLoading && (
            <Loading
              className={
                'neutrix-text-white neutrix-absolute neutrix-right-1 neutrix-bottom-2'
              }
            />
          )}

          <Button
            size={'icon'}
            className={cn(
              'neutrix-absolute neutrix-right-1 neutrix-top-0 hover:neutrix-opacity-75 neutrix-bg-transparent hover:neutrix-bg-transparent neutrix-text-primary',
              isAccent && 'neutrix-text-white',
            )}
            onClick={() => setOpen(false)}
          >
            <Minus className={'neutrix-w-6 neutrix-h-6'} />{' '}
          </Button>
        </DialogHeader>
        <ScrollArea
          className="neutrix-w-full"
          style={{ height: `${chatHeight}px` }}
        >
          <div
            className={
              'neutrix-p-5 neutrix-flex neutrix-flex-col neutrix-gap-5'
            }
            ref={chatContainerRef}
          >
            {!isAwayFrom &&
              messages.map((message: ChatMessage) =>
                chatSettings?.chat?.advanced?.feedbackCollection &&
                message?.status === 'close' ? (
                  <CollectFeedback
                    key={message?.createdAt?.toString()}
                    message={message}
                    handleCloseChat={setIsCloseChat}
                    isCloseChat={isCloseChat}
                  />
                ) : message?.senderId === visitor.id ? (
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

            {!isAwayFrom && messages?.length === 1 && (
              <div
                className={
                  'neutrix-text-sm neutrix-font-semibold neutrix-bg-secondary neutrix-p-4 neutrix-rounded-md neutrix-text-primary/75'
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
                      'neutrix-text-sm neutrix-font-semibold',
                      !isRequirePreQualification &&
                        'neutrix-bg-secondary neutrix-p-4 neutrix-rounded-md neutrix-my-6',
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

        {(!isRequirePreQualification || messages.length > 0) &&
          !isAwayFrom &&
          !isCloseChat && (
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
