import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { Question, Survey } from '@/models/surveyModels'
import ActionButton from '@/src/components/ui/action-button'
import DialogWrapper from '@/src/components/DialogWrapper'
import ThankYouDialog from '@/src/components/ThankYouDialog'
import { useDialog } from '@/hooks/useDialog'
import { Textarea } from '@/src/components/ui/textarea'
import { Button } from '@/src/components/ui/button'
import { VisitorResponse } from '@/models/responseModels'
import { handleSurveyResponse } from '@/utils/surveys.utils'

interface props {
  survey: Survey
  id: string
  handleResponse: (response: VisitorResponse) => void
}

const OpenEndedDialog = ({ survey, id, handleResponse }: props) => {
  const { close, currentDialog } = useDialog()
  const questions = survey?.settings?.questions?.data
  const [question, setQuestion] = React.useState<Question | null>(
    questions[0] || null,
  )
  const [current, setCurrent] = React.useState(1)
  const [showThanks, setShowThanks] = React.useState(false)
  const [questionAnswer, setQuestionAnswer] = React.useState<
    Map<string, string>
  >(new Map())
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

  useEffect(() => {
    setQuestion(questions[current - 1] || null)
  }, [current])

  const onAnswerHandle = () => {
    if (question) {
      handleOpenEndedResponse()
      if (current === questions.length) {
        close()
        setShowThanks(true)
      }
    }
  }

  const handleOpenEndedResponse = () => {
    const responseTime = Date.now() - startTime
    const response = handleSurveyResponse({
      status: current === questions?.length ? 'completed' : 'viewed',
      survey,
      question,
      comment: questionAnswer.get(question?.id || ''),
      responseTime,
    })
    handleResponse(response)
  }

  const moveNext = () => {
    setCurrent((prev) => prev + 1)
    setStartTime(Date.now())
    onAnswerHandle()
  }

  const movePrevious = () => {
    setCurrent((prev) => prev - 1)
    setStartTime(Date.now())
    onAnswerHandle()
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
              'neutrix-rounded-2xl neutrix-max-w-[250px] neutrix-space-y-1'
            }
          >
            <DialogHeader>
              <DialogTitle>{question?.title} </DialogTitle>
              {question?.includeSubtitle && (
                <DialogDescription>{question?.subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <Textarea
              className={'!neutrix-mt-2'}
              placeholder={question?.meta?.comment || 'Enter response here...'}
              onChange={(e) => {
                setQuestionAnswer((prevAnswers) => {
                  const newAnswers = new Map(prevAnswers)
                  newAnswers.set(question.id, e.target.value)
                  return newAnswers
                })
              }}
            />

            {current === questions?.length && (
              <Button
                size={'sm'}
                className={'neutrix-font-bold neutrix-h-8 neutrix-mt-4'}
                onClick={onAnswerHandle}
              >
                Send
              </Button>
            )}

            {questions?.length > 1 && (
              <div
                className={
                  'neutrix-flex neutrix-items-center neutrix-justify-between neutrix-text-sm neutrix-text-muted-foreground neutrix-mt-1'
                }
              >
                <ActionButton
                  size={'sm'}
                  title={'Prev'}
                  disabled={current === 1}
                  onClick={movePrevious}
                />
                <div className={'neutrix-tracking-wider'}>
                  {current}/{questions?.length}
                </div>
                <ActionButton
                  size={'sm'}
                  title={'Next'}
                  disabled={current === questions?.length}
                  onClick={moveNext}
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
          handleFeedback={handleFeedback}
        />
      )}
    </>
  )
}

export default OpenEndedDialog
