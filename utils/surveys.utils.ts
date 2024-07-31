import { Survey, SurveyEnumType } from '@/src/models/surveyModels'
import { checkIfDurationExceeded } from './date.utils'
import { checkIfVisibleInCurrentPath } from './audience.utils'

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
