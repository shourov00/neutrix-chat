import { Question, Survey, SurveyEnumType } from '@/models/surveyModels'
import { checkIfDurationExceeded } from './date.utils'
import { checkIfVisibleInCurrentPath } from './audience.utils'
import { VisitorChoice, VisitorResponse } from '@/models/responseModels'

export const filterSurveys = (type: SurveyEnumType, surveys: Survey[]) => {
  return (
    surveys?.filter(
      (survey: Survey) =>
        survey.type === type &&
        checkIfDurationExceeded(
          survey?.settings?.delivery?.startAt,
          survey?.settings?.delivery?.durationDays,
        ) &&
        checkIfVisibleInCurrentPath(
          survey?.settings?.audience,
          window.location.href,
        ),
    ) || []
  )
}

interface SurveyResponseProps {
  status?: 'viewed' | 'completed' | 'dismissed'
  survey: Survey
  question?: Question | null
  choices?: VisitorChoice[]
  comment?: string
  commentPreview?: string
  responseTime?: number
  feedback?: string
}

export const handleSurveyResponse = ({
  status = 'completed',
  survey,
  question,
  choices,
  comment,
  commentPreview,
  responseTime,
  feedback,
}: SurveyResponseProps): VisitorResponse => {
  return {
    responseId: survey?._id,
    responseType: 'survey',
    status,
    meta: {
      questions: {
        data: [
          {
            id: question?.id,
            meta: {
              choices,
              comment,
              commentPreview,
              responseTime,
            },
            type: survey?.type,
          },
        ],
      },
      feedback,
    },
  }
}

export function ratingNumberToText(num: number): string {
  const numberWords: any = {
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
  }

  return numberWords[num] || 'Number out of range'
}
