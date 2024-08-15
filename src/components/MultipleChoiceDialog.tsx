import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React, { useEffect } from 'react'
import { Question, QuestionChoices, Survey } from '@/models/surveyModels'
import ActionButton from '@/src/components/ui/action-button'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'
import { Button } from '@/src/components/ui/button'
import ThankYouDialog from '@/src/components/ThankYouDialog'
import { VisitorChoice, VisitorResponse } from '@/models/responseModels'
import { handleSurveyResponse } from '@/utils/surveys.utils'

interface props {
  survey: Survey
  id: string
  handleResponse: (response: VisitorResponse) => void
}

const MultipleChoiceDialog = ({ survey, id, handleResponse }: props) => {
  const { close, currentDialog } = useDialog()
  const questions = survey?.settings?.questions?.data
  const [question, setQuestion] = React.useState<Question | null>(
    questions[0] || null,
  )
  const [checkedValue, setCheckedValue] = React.useState<string[]>([])
  const [current, setCurrent] = React.useState(1)
  const [showThanks, setShowThanks] = React.useState(false)
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

  const handleChecked = (name: string) => {
    if (!checkedValue.includes(name)) {
      setCheckedValue((prev) => [...prev, name])
    } else {
      setCheckedValue(checkedValue.filter((item) => item !== name))
    }
  }

  const handleMultipleChoiceResponse = (choice?: string) => {
    const responseTime = Date.now() - startTime
    const choices = question?.meta?.choices?.filter(
      (item) => choice === item.name || checkedValue.includes(item.name),
    )
    const newChoices: VisitorChoice[] =
      choices?.map((item) => ({
        name: item.name,
        id: item?.id || '',
        responseTime,
      })) || []
    const response = handleSurveyResponse({
      status: current === questions?.length ? 'completed' : 'viewed',
      survey,
      question,
      choices: newChoices,
    })
    handleResponse(response)
  }

  const moveNext = () => {
    setCurrent((prev) => prev + 1)
    setStartTime(Date.now())
  }

  const movePrevious = () => {
    setCurrent((prev) => prev - 1)
    setStartTime(Date.now())
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

            <div className={'neutrix-flex neutrix-flex-col neutrix-gap-3'}>
              {question?.meta?.choices?.map(
                (choice: QuestionChoices, index: number) => (
                  <ActionButton
                    key={index}
                    title={choice?.name}
                    className={
                      'neutrix-bg-secondary neutrix-w-full neutrix-shadow hover:neutrix-shadow-md neutrix-justify-start'
                    }
                    onClick={(e) => {
                      if (question?.meta?.multipleSelect) {
                        e.preventDefault()
                        handleChecked(choice?.name)
                      } else {
                        if (current !== questions?.length) {
                          moveNext()
                        } else {
                          close()
                          handleMultipleChoiceResponse(choice?.name)
                          setShowThanks(true)
                        }
                      }
                    }}
                    isChecked={checkedValue.includes(choice?.name)}
                    isCheckBox={question?.meta?.multipleSelect}
                  />
                ),
              )}
              {question?.meta?.multipleSelect && (
                <Button
                  variant={checkedValue.length > 0 ? 'default' : 'secondary'}
                  size={'sm'}
                  className={'neutrix-font-bold neutrix-h-8 neutrix-mt-4'}
                  onClick={() => {
                    if (checkedValue.length > 0) {
                      handleMultipleChoiceResponse()
                      if (current !== questions?.length) {
                        moveNext()
                      } else {
                        close()
                        setShowThanks(true)
                      }
                    }
                  }}
                >
                  Send
                </Button>
              )}
            </div>

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

export default MultipleChoiceDialog
