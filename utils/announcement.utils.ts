import {
  Announcement,
  AnnouncementEnumType,
  AnnouncementResponseProps,
} from '@/models/announcementModels'
import { checkIfDurationExceeded } from './date.utils'
import { checkIfVisibleInCurrentPath } from './audience.utils'
import { VisitorResponse } from '@/models/responseModels'

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

export const handleAnnouncementResponse = ({
  status = 'completed',
  announcement,
  devices,
}: AnnouncementResponseProps): VisitorResponse => {
  return {
    responseId: announcement?._id,
    responseType: 'announcement',
    status,
    meta: {
      devices,
    },
  }
}

export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const ua = navigator.userAgent

  if (/Mobi|Android/i.test(ua)) {
    return 'mobile'
  }

  if (/Tablet|iPad/i.test(ua)) {
    return 'tablet'
  }

  return 'desktop'
}
