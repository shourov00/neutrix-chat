import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React, { useEffect } from 'react'
import { Survey } from '@/models/surveyModels'
import DialogWrapper from '@/src/components/DialogWrapper'
import ThankYouDialog from '@/src/components/ThankYouDialog'
import { useDialog } from '@/hooks/useDialog'
import { Button } from '@/src/components/ui/button'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { VisitorChoice, VisitorResponse } from '@/models/responseModels'
import { handleSurveyResponse } from '@/utils/surveys.utils'

interface props {
  survey: Survey
  id: string
  handleResponse: (response: VisitorResponse) => void
}

const LikeDislikeDialog = ({ survey, id, handleResponse }: props) => {
  const { close, currentDialog } = useDialog()
  const question = survey?.settings?.questions?.data?.[0] || null
  const [showThanks, setShowThanks] = React.useState(false)
  const [showLowRatingThanks, setShowLowRatingThanks] = React.useState(false)
  const [startTime, setStartTime] = React.useState<number>(0)

  useEffect(() => {
    if (currentDialog === id) {
      setStartTime(Date.now())
      const response = handleSurveyResponse({
        status: 'viewed',
        survey,
      })
      handleResponse(response)
    }
  }, [currentDialog])

  const handleLikeDislikeResponse = (isLike: boolean) => {
    const responseTime = Date.now() - startTime
    const choices: VisitorChoice[] = [
      {
        id: isLike ? 'like' : 'dislike',
        name: isLike ? 'like' : 'dislike',
        responseTime,
      },
    ]
    const response = handleSurveyResponse({ survey, question, choices })
    handleResponse(response)
  }

  const handleDialogClose = () => {
    const response = handleSurveyResponse({
      status: 'dismissed',
      survey,
    })
    handleResponse(response)
  }

  const handleFeedback = (feedback: string) => {
    const response = handleSurveyResponse({
      survey,
      feedback,
    })
    handleResponse(response)
  }

  return (
    <>
      {question && (
        <DialogWrapper id={id} onClose={handleDialogClose}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            className={
              'neutrix-rounded-2xl neutrix-max-w-[220px] neutrix-space-y-1'
            }
          >
            <DialogHeader>
              <DialogTitle>{question?.title}</DialogTitle>
              {!question?.includeSubtitle && (
                <DialogDescription>{question?.subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <div
              className={
                'neutrix-flex neutrix-gap-4 neutrix-items-center neutrix-justify-center'
              }
            >
              <Button
                variant={'secondary'}
                className={
                  'neutrix-h-10 neutrix-shadow-md hover:neutrix-shadow-lg hover:neutrix-bg-white neutrix-transition-all'
                }
                onClick={() => {
                  handleLikeDislikeResponse(true)
                  close()
                  setShowThanks(true)
                }}
              >
                <ThumbsUp className={'neutrix-w-4 neutrix-h-4'} />
              </Button>

              <Button
                variant={'secondary'}
                className={
                  'neutrix-h-10 neutrix-shadow-md hover:neutrix-shadow-lg hover:neutrix-bg-white neutrix-transition-all'
                }
                onClick={() => {
                  handleLikeDislikeResponse(false)
                  close()
                  setShowLowRatingThanks(true)
                }}
              >
                <ThumbsDown className={'neutrix-w-4 neutrix-h-4'} />
              </Button>
            </div>
          </DialogContent>
        </DialogWrapper>
      )}

      {showThanks && (
        <ThankYouDialog
          id={id + 1}
          thanks={survey?.settings?.thanks?.default}
          handleFeedback={handleFeedback}
        />
      )}
      {showLowRatingThanks && survey?.settings?.thanks?.lowRating?.enabled && (
        <ThankYouDialog
          id={id + 2}
          thanks={survey?.settings?.thanks?.lowRating}
          handleFeedback={handleFeedback}
        />
      )}
    </>
  )
}

export default LikeDislikeDialog
