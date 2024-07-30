import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React, { useEffect } from 'react'
import { Question, QuestionChoices, Survey } from '@/src/models/surveyModels'
import ActionButton from '@/src/components/ui/action-button'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'

interface props {
  survey: Survey
  id: string
}

const MultipleChoiceDialog = ({ survey, id }: props) => {
  const { close } = useDialog()
  const questions = survey?.settings?.questions?.data
  const [question, setQuestion] = React.useState<Question | null>(
    questions[0] || null,
  )
  const [current, setCurrent] = React.useState(1)

  useEffect(() => {
    setQuestion(questions[current - 1])
  }, [current])

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
              {question?.subtitle && (
                <DialogDescription>{question?.subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <div className={'flex flex-col gap-2'}>
              {question?.meta?.choices?.map(
                (choice: QuestionChoices, index: number) => (
                  <ActionButton
                    key={index}
                    title={choice?.name}
                    className={
                      'bg-secondary w-full shadow hover:shadow-md justify-start'
                    }
                    onClick={() => {
                      close()
                    }}
                  />
                ),
              )}
            </div>

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
    </>
  )
}

export default MultipleChoiceDialog
