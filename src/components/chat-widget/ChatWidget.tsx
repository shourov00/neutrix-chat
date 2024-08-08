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
import { Minus, SendHorizonal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DialogDescription } from '@radix-ui/react-dialog'
import ChatInputBar from '@/src/components/chat-widget/ChatInputBar'
import PreQualificationForm from '@/src/components/chat-widget/PreQualificationForm'
import AwayFrom from '@/src/components/chat-widget/AwayFrom'
import { ChatMessage } from '@/models/chatModels'
import { useVisitor } from '@/hooks/useVisitor'
import { getSiteIdAtom } from '@/hooks/siteIdStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addVisitorChat, getChatMessages } from '@/api'
import SenderMessage from '@/src/components/chat-widget/SenderMessage'
import { CHAT_MESSAGES } from '@/api/types'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import Loading from '@/src/components/ui/loading'
import ReceiverMessage from '@/src/components/chat-widget/ReceiverMessage'

const URL = process.env.CHAT_WEBSOCKET_API_ENDPOINT

const ChatWidget = () => {
  const socket = useRef<WebSocket | null>(null)
  const [visitor, setVisitor] = useVisitor()
  const [isConnected, setIsConnected] = useState(false)
  const [open, setOpen] = useState<boolean>(false)
  const [isAccent, setIsAccent] = useState<boolean>(true)
  const [isRequirePreQualification, setIsRequirePreQualification] =
    useState<boolean>(false)
  const [isAwayFrom, setIsAwayFrom] = useState<boolean>(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatHeight, setChatHeight] = useState<number>(550)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { data: previousChats, isLoading } = useChatMessages(visitor.chatId, 1)

  useEffect(() => {
    if (previousChats && !isLoading) {
      setMessages(previousChats.data)
    }
  }, [previousChats])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 0) // Delay to ensure DOM updates

      return () => clearTimeout(timer)
    }
  }, [open, messages])

  const { mutate: mutateNewChatRoom } = useMutation({
    mutationFn: () =>
      addVisitorChat({
        siteId: getSiteIdAtom(),
        visitor: visitor.id,
        status: 'active',
      }),
    onSuccess: (data) => {
      setVisitor({
        ...visitor,
        chatId: data?.data?.data?._id,
      })
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const onSocketOpen = useCallback(() => {
    setIsConnected(true)
    if (!visitor.chatId) {
      mutateNewChatRoom()
    }
  }, [visitor.chatId, mutateNewChatRoom])

  const onSocketClose = useCallback(() => {
    setIsConnected(false)
    // socket.current?.send(JSON.stringify({ action: 'disconnect' }));
  }, [])

  const onSocketMessage = useCallback((dataStr: string) => {
    const data = JSON.parse(dataStr)
    setMessages((prev) => [...prev, data])
  }, [])

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN && URL) {
      socket.current = new WebSocket(URL)
      socket.current.addEventListener('open', onSocketOpen)
      socket.current.addEventListener('close', onSocketClose)
      socket.current.addEventListener('message', (event) => {
        onSocketMessage(event.data)
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      socket.current?.close()
    }
  }, [])

  const onSendMessage = useCallback((chatMessage: ChatMessage) => {
    socket.current?.send(
      JSON.stringify({
        action: 'setName',
        ...chatMessage,
      }),
    )
    setMessages((prev) => [...prev, chatMessage])
  }, [])

  const onDisconnect = useCallback(() => {
    if (isConnected) {
      socket.current?.close()
    }
  }, [isConnected])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            'p-[12px] bottom-0 right-0 fixed mb-4 mr-4 bg-white transition-all hover:bg-white h-14 w-14 rounded-2xl drop-shadow-lg hover:drop-shadow-xl'
          }
          onClick={onConnect}
        >
          <ChatIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        animationClassName={'data-[state=closed]:animate-slideInDown'}
        className="sm:max-w-[400px] bottom-4 right-4 p-0 gap-0"
        isClose={false}
      >
        <DialogHeader
          className={cn(
            'bg-secondary rounded-t-xl p-4 flex-row flex items-center gap-4 relative space-y-0',
            isAccent && 'bg-primary',
          )}
        >
          <img
            src={
              'https://storage.googleapis.com/lucky-orange-public-uploads/ce8c9e46/5MDBl4kBGmLb4OTNNTBw'
            }
            alt={'neutrix'}
            className={'rounded-full object-cover w-8 h-8 shadow-xl'}
          />
          <div>
            <DialogTitle
              className={cn(
                'text-lg font-bold text-primary',
                isAccent && 'text-white',
              )}
            >
              My Site
            </DialogTitle>
            <DialogDescription
              className={cn(
                'text-xs text-primary font-light',
                isAccent && 'text-secondary',
              )}
            >
              Representative
            </DialogDescription>
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

            {!messages.length && (
              <>
                {isAwayFrom ? (
                  <AwayFrom />
                ) : (
                  <>
                    <div
                      className={cn(
                        'text-sm font-semibold',
                        !isRequirePreQualification &&
                          'bg-secondary p-4 rounded-md my-6',
                      )}
                    >
                      Hello! Enter throw us a question below and we&apos;ll find
                      the right person to help you
                    </div>

                    {isRequirePreQualification && (
                      <>
                        <PreQualificationForm />

                        <Button
                          type="button"
                          className={'font-bold py-6 w-fit ms-auto'}
                        >
                          <SendHorizonal className={'w-5 h-5 mr-2'} />
                          Start Chatting
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {!isRequirePreQualification && (
          <ChatInputBar
            onSendMessage={onSendMessage}
            setChatHeight={setChatHeight}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

const useChatMessages = (chatId: string, page: number) =>
  useQuery({
    queryKey: [CHAT_MESSAGES],
    queryFn: () =>
      getChatMessages(chatId, {
        page,
      }).then((res) => res.data.data),
  })

export default ChatWidget
