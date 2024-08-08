import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import React from 'react'
import { InviteSettings, Survey, SurveyEnumType } from '@/models/surveyModels'
import ActionButton from '@/src/components/ui/action-button'
import RatingDialog from '@/src/components/RatingDialog'
import DialogWrapper from '@/src/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'
import OpenEndedDialog from '@/src/components/OpenEndedDialog'
import { VisitorResponse } from '@/models/responseModels'

interface props {
  invite: InviteSettings
  survey: Survey
  id: string
  handleResponse: (response: VisitorResponse) => void
}

const InviteDialog = ({ invite, survey, id, handleResponse }: props) => {
  const { close } = useDialog()
  const [showQuestions, setShowQuestions] = React.useState(false)

  return (
    <>
      {invite && (
        <DialogWrapper id={id}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            className={'rounded-2xl max-w-[250px] space-y-1'}
          >
            <DialogHeader>
              <DialogTitle>{invite?.title}</DialogTitle>
              {invite?.subtitle && (
                <DialogDescription>{invite?.subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <div className={'flex flex-col gap-2'}>
              <ActionButton
                title={invite?.buttonYesLabel}
                className={
                  'bg-secondary w-full shadow hover:shadow-md justify-start'
                }
                onClick={() => {
                  setShowQuestions(true)
                  close()
                }}
              />
              <ActionButton
                title={invite?.buttonNoLabel}
                className={
                  'bg-secondary w-full shadow hover:shadow-md justify-start'
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
    </>
  )
}

export default InviteDialog
