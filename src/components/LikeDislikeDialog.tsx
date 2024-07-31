import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React from 'react'
import { Survey } from '@/src/models/surveyModels'
import DialogWrapper from '@/src/components/DialogWrapper'
import ThankYouDialog from '@/src/components/ThankYouDialog'
import { useDialog } from '@/hooks/useDialog'
import { Button } from '@/src/components/ui/button'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

interface props {
  survey: Survey
  id: string
}

const LikeDislikeDialog = ({ survey, id }: props) => {
  const { close } = useDialog()
  const question = survey?.settings?.questions?.data?.[0] || null
  const [showThanks, setShowThanks] = React.useState(false)
  const [showLowRatingThanks, setShowLowRatingThanks] = React.useState(false)

  return (
    <>
      {question && (
        <DialogWrapper id={id}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            className={'rounded-2xl max-w-[220px] space-y-1'}
          >
            <DialogHeader>
              <DialogTitle>{question?.title}</DialogTitle>
              {!question?.includeSubtitle && (
                <DialogDescription>{question?.subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <div className={'flex gap-4 items-center justify-center'}>
              <Button
                variant={'secondary'}
                className={
                  'h-10 shadow-md hover:shadow-lg hover:bg-white transition-all'
                }
                onClick={() => {
                  close()
                  setShowThanks(true)
                }}
              >
                <ThumbsUp className={'w-4 h-4'} />
              </Button>

              <Button
                variant={'secondary'}
                className={
                  'h-10 shadow-md hover:shadow-lg hover:bg-white transition-all'
                }
                onClick={() => {
                  close()
                  setShowLowRatingThanks(true)
                }}
              >
                <ThumbsDown className={'w-4 h-4'} />
              </Button>
            </div>
          </DialogContent>
        </DialogWrapper>
      )}

      {showThanks && (
        <ThankYouDialog
          id={id + 1}
          thanks={survey?.settings?.thanks?.default}
        />
      )}
      {showLowRatingThanks && survey?.settings?.thanks?.lowRating?.enabled && (
        <ThankYouDialog
          id={id + 2}
          thanks={survey?.settings?.thanks?.lowRating}
        />
      )}
    </>
  )
}

export default LikeDislikeDialog
