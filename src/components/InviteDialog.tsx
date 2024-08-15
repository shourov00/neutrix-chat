import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React, { useEffect } from 'react'
import { InviteSettings, Survey, SurveyEnumType } from '@/models/surveyModels'
import ActionButton from '@/src/components/ui/action-button'
import RatingDialog from '@/src/components/RatingDialog'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'
import OpenEndedDialog from '@/src/components/OpenEndedDialog'
import { VisitorResponse } from '@/models/responseModels'
import MultipleChoiceDialog from '@/src/components/MultipleChoiceDialog'
import { handleSurveyResponse } from '@/utils/surveys.utils'

interface props {
  invite: InviteSettings
  survey: Survey
  id: string
  handleResponse: (response: VisitorResponse) => void
}

const InviteDialog = ({ invite, survey, id, handleResponse }: props) => {
  const { close, currentDialog } = useDialog()
  const [showQuestions, setShowQuestions] = React.useState(false)

  useEffect(() => {
    if (currentDialog === id) {
      const response = handleSurveyResponse({
        status: 'viewed',
        survey,
      })
      handleResponse(response)
    }
  }, [currentDialog])

  return (
    <>
      {invite && (
        <DialogWrapper id={id}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            className={
              'neutrix-rounded-2xl neutrix-max-w-[250px] neutrix-space-y-1'
            }
          >
            <DialogHeader>
              <DialogTitle>{invite?.title}</DialogTitle>
              {invite?.subtitle && (
                <DialogDescription>{invite?.subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <div className={'neutrix-flex neutrix-flex-col neutrix-gap-2'}>
              <ActionButton
                title={invite?.buttonYesLabel}
                className={
                  'neutrix-bg-secondary neutrix-w-full neutrix-shadow hover:neutrix-shadow-md neutrix-justify-start'
                }
                onClick={() => {
                  setShowQuestions(true)
                  close()
                }}
              />
              <ActionButton
                title={invite?.buttonNoLabel}
                className={
                  'neutrix-bg-secondary neutrix-w-full neutrix-shadow hover:neutrix-shadow-md neutrix-justify-start'
                }
                onClick={close}
              />
            </div>
          </DialogContent>
        </DialogWrapper>
      )}

      {showQuestions && survey.type === SurveyEnumType.RATING && (
        <RatingDialog
          survey={survey}
          id={id + 1}
          handleResponse={handleResponse}
        />
      )}

      {showQuestions && survey.type === SurveyEnumType.OPEN_ENDED && (
        <OpenEndedDialog
          survey={survey}
          id={id + 2}
          handleResponse={handleResponse}
        />
      )}

      {showQuestions && survey.type === SurveyEnumType.MULTIPLE_CHOICE && (
        <MultipleChoiceDialog
          survey={survey}
          id={id + 3}
          handleResponse={handleResponse}
        />
      )}
    </>
  )
}

export default InviteDialog
