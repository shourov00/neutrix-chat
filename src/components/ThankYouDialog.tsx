import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React from 'react'
import { ThanksSettings } from '@/src/models/surveyModels'
import DialogWrapper from '@/src/components/DialogWrapper'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'

interface props {
  thanks?: ThanksSettings
  id: string
}

const ThankYouDialog = ({ thanks, id }: props) => {
  return (
    <>
      {thanks && (
        <DialogWrapper id={id}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            className={'rounded-2xl max-w-[250px] space-y-1'}
          >
            <DialogHeader>
              <DialogTitle>{thanks?.title} </DialogTitle>
            </DialogHeader>

            {thanks?.allowFeedback && (
              <Input
                type="text"
                className={'mt-6'}
                placeholder={thanks?.placeholder || 'Tell us more...'}
              />
            )}

            {thanks?.button?.active && (
              <Button className={'w-full font-bold mt-6'} asChild>
                <a href={thanks?.button?.link} target={'_blank'}>
                  {thanks?.button?.label}
                </a>
              </Button>
            )}
          </DialogContent>
        </DialogWrapper>
      )}
    </>
  )
}

export default ThankYouDialog
