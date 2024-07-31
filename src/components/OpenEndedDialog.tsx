import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React, { useEffect } from 'react'
import { Question, Survey } from '@/src/models/surveyModels'
import ActionButton from '@/src/components/ui/action-button'
import DialogWrapper from '@/src/components/DialogWrapper'
import ThankYouDialog from '@/src/components/ThankYouDialog'
import { useDialog } from '@/hooks/useDialog'
import { Textarea } from '@/src/components/ui/textarea'
import { Button } from '@/src/components/ui/button'

interface props {
  survey: Survey
  id: string
}

const OpenEndedDialog = ({ survey, id }: props) => {
  const { close } = useDialog()
  const questions = survey?.settings?.questions?.data
  const [question, setQuestion] = React.useState<Question | null>(
    questions[0] || null,
  )
  const [current, setCurrent] = React.useState(1)
  const [showThanks, setShowThanks] = React.useState(false)
  const [questionAnswer, setQuestionAnswer] = React.useState<
    Map<string, string>
  >(new Map())

  useEffect(() => {
    setQuestion(questions[current - 1] || null)
  }, [current])

  const onAnswerHandle = (answer: string) => {
    if (question) {
      setQuestionAnswer((prevAnswers) => {
        const newAnswers = new Map(prevAnswers)
        newAnswers.set(question.id, answer)
        return newAnswers
      })
    }
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

            <Textarea
              className={'!mt-2'}
              placeholder={question?.meta?.comment || 'Enter response here...'}
              onChange={(e) => onAnswerHandle(e.target.value)}
            />

            {questions?.length === 1 && (
              <Button
                size={'sm'}
                className={'font-bold h-8 mt-4'}
                onClick={() => {
                  close()
                  setShowThanks(true)
                }}
              >
                Send
              </Button>
            )}

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
                  onClick={() => {
                    if (current < questions.length) {
                      setCurrent((prev) => prev + 1)
                    } else {
                      close()
                      setShowThanks(true)
                    }
                  }}
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
    </>
  )
}

export default OpenEndedDialog
