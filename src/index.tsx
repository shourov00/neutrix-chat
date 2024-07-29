import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { addResponseMessage, Widget } from 'react-chat-widget'
import 'react-chat-widget/lib/styles.css'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const App: React.FC = () => {
  const [open, setOpen] = React.useState(true)

  useEffect(() => {
    addResponseMessage('Welcome')
  }, [])

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`)
    // Now send the message throught the backend API
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          className={'rounded-xl max-w-[250px] space-y-1'}
        >
          <img
            src={
              'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
            alt={'password'}
            className={'rounded-lg object-cover border w-full h-[126px]'}
          />

          <DialogHeader>
            <DialogTitle>Hi, welcome to our website. </DialogTitle>
            <DialogDescription>This is an announcement.</DialogDescription>
          </DialogHeader>

          <Button
            className={'w-full rounded-xl'}
            onClick={() => setOpen(false)}
          >
            Got it
          </Button>
        </DialogContent>
      </Dialog>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Join Neutrix Chat Room"
        subtitle="This is cool subtitle"
      />
    </>
  )
}

;(function () {
  const widgetContainer = document.createElement('div')
  widgetContainer.id = 'root'
  widgetContainer.style.zIndex = '9999'
  document.body.appendChild(widgetContainer)

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  )
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})()
