import { Announcement, AnnouncementEnumType } from '@/models/announcementModels'
import { checkIfDurationExceeded } from './date.utils'
import { checkIfVisibleInCurrentPath } from './audience.utils'

export const filterAnnouncements = (
  type: AnnouncementEnumType,
  surveys: Announcement[],
) => {
  return (
    surveys?.filter(
      (survey: Announcement) =>
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
