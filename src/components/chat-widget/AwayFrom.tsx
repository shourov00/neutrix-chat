import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Clock5, SendHorizonal } from 'lucide-react'
import AwayFromForm from '@/src/components/chat-widget/AwayFromForm'

const AwayFrom = () => {
  const [displayOfficeHours, setDisplayOfficeHours] = useState(true)

  return (
    <>
      {displayOfficeHours && (
        <div
          className={
            'p-4 w-full rounded-md font-bold flex gap-1 text-xs items-center justify-center border'
          }
        >
          <Clock5 className={'w-4 h-4'} />
          <span>Back online from 7PM - 4AM</span>
        </div>
      )}

      <div className={cn('text-sm font-semibold')}>
        Hello there. Our team is currently offline. Please leave your email and
        send us a message. We usually reply within a couple hours
      </div>

      <AwayFromForm />

      <Button type="button" className={'font-bold py-6 w-fit ms-auto'}>
        <SendHorizonal className={'w-5 h-5 mr-2'} />
        Send Message
      </Button>
    </>
  )
}

export default AwayFrom
