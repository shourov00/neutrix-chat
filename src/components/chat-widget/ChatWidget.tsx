import React, { useState } from 'react'
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

const ChatWidget = () => {
  const [open, setOpen] = useState<boolean>(true)
  const [isAccent, setIsAccent] = useState<boolean>(true)
  const [isRequirePreQualification, setIsRequirePreQualification] =
    useState<boolean>(true)
  const [isAwayFrom, setIsAwayFrom] = useState<boolean>(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            'p-[12px] bottom-0 right-0 fixed mb-4 mr-4 bg-white transition-all hover:bg-white h-14 w-14 rounded-2xl drop-shadow-lg hover:drop-shadow-xl'
          }
        >
          <ChatIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="sm:max-w-[400px] bottom-[90px] p-0"
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
        <div className={'p-5 flex flex-col gap-5'}>
          {isAwayFrom ? (
            <AwayFrom />
          ) : (
            <>
              <div
                className={cn(
                  'text-sm font-semibold',
                  !isRequirePreQualification && 'bg-secondary p-4 rounded-md',
                )}
              >
                Hello! Enter throw us a question below and we&apos;ll find the
                right person to help you
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
        </div>

        {!isRequirePreQualification && <ChatInputBar />}
      </DialogContent>
    </Dialog>
  )
}

export default ChatWidget
