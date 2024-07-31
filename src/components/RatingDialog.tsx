import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React, { useEffect } from 'react'
import { Question, Survey } from '@/src/models/surveyModels'
import Ratings from '@/src/components/ui/ratings'
import ActionButton from '@/src/components/ui/action-button'
import DialogWrapper from '@/src/components/DialogWrapper'
import ThankYouDialog from '@/src/components/ThankYouDialog'
import { useDialog } from '@/hooks/useDialog'

interface props {
  survey: Survey
  id: string
}

const RatingDialog = ({ survey, id }: props) => {
  const { close } = useDialog()
  const questions = survey?.settings?.questions?.data
  const [question, setQuestion] = React.useState<Question | null>(
    questions[0] || null,
  )
  const [current, setCurrent] = React.useState(1)
  const [showThanks, setShowThanks] = React.useState(false)
  const [showLowRatingThanks, setShowLowRatingThanks] = React.useState(false)
  const [questionRating, setQuestionRating] = React.useState<
    Map<string, number>
  >(new Map())

  useEffect(() => {
    setQuestion(questions[current - 1] || null)
  }, [current])

  const onRatingHandle = (rating: number) => {
    if (question) {
      setQuestionRating((prevRatings) => {
        const newRatings = new Map(prevRatings)
        newRatings.set(question.id, rating)
        return newRatings
      })

      if (current < questions.length) {
        setCurrent((prev) => prev + 1)
      } else if (current === questions.length) {
        close()
        const averageRating = calculateAverageRating(questionRating)
        if (averageRating >= 4 && averageRating <= 5) {
          setShowThanks(true)
        } else {
          setShowLowRatingThanks(true)
        }
      }
    }
  }

  const calculateAverageRating = (ratings: Map<string, number>) => {
    let total = 0
    let count = 0
    ratings.forEach((rating) => {
      total += rating
      count += 1
    })
    return count === 0 ? 0 : total / count
  }

  return (
    <>
      {question && (
        <DialogWrapper id={id}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            className={'rounded-2xl max-w-[250px] space-y-1'}
          >
            <DialogHeader>
              <DialogTitle>{question?.title} </DialogTitle>
              {question?.includeSubtitle && (
                <DialogDescription>{question?.subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <Ratings
              rating={questionRating.get(question?.id)}
              onRatingStarChange={onRatingHandle}
            />

            {questions?.length > 1 && (
              <div
                className={
                  'flex items-center justify-between text-sm text-muted-foreground mt-1'
                }
              >
                <ActionButton
                  size={'sm'}
                  title={'Prev'}
                  disabled={current === 1}
                  onClick={() => setCurrent((prev) => prev - 1)}
                />
                <div className={'tracking-wider'}>
                  {current}/{questions?.length}
                </div>
                <ActionButton
                  size={'sm'}
                  title={'Next'}
                  disabled={current === questions?.length}
                  onClick={() => setCurrent((prev) => prev + 1)}
                />
              </div>
            )}
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

export default RatingDialog
