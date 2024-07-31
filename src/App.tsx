import React, { useEffect } from 'react'
import { addResponseMessage, Widget } from 'react-chat-widget'
import './global.css'
import 'react-chat-widget/lib/styles.css'
import { Survey, SurveyEnumType } from '@/src/models/surveyModels'
import InviteDialog from '@/src/components/InviteDialog'
import RatingDialog from '@/src/components/RatingDialog'
import { useQuery } from '@tanstack/react-query'
import { ANNOUNCEMENTS, SURVEYS } from '@/api/types'
import { getAnnouncements, getSurveys } from '@/api/surveys'
import { v4 as uuidv4 } from 'uuid'
import AnnouncementDialog from '@/src/components/AnnouncementDialog'
import MultipleChoiceDialog from '@/src/components/MultipleChoiceDialog'
import LikeDislikeDialog from '@/src/components/LikeDislikeDialog'
import OpenEndedDialog from '@/src/components/OpenEndedDialog'
import { setSiteIdAtom } from '@/hooks/siteIdStore'
import {
  Announcement,
  AnnouncementEnumType,
} from '@/src/models/announcementModels'
import { checkIfDurationExceeded } from '@/utils/date.utils'

interface props {
  siteId: string
}

export default function App({ siteId }: props) {
  const { data: surveys, isLoading } = useSurveys()
  const { data: announcements, isLoading: isAnnouncementLoading } =
    useAnnouncements()

  useEffect(() => {
    addResponseMessage('Welcome')

    // todo remove hardcoded siteID
    setSiteIdAtom('123123123')
  }, [siteId])

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`)
  }

  const ratingSurveys =
    surveys?.filter(
      (survey: Survey) =>
        survey.type === SurveyEnumType.RATING &&
        checkIfDurationExceeded(
          survey?.settings?.delivery?.startAt,
          survey?.settings?.delivery?.durationDays,
        ),
    ) || []

  const multipleChoiceSurveys =
    surveys?.filter(
      (survey: Survey) =>
        survey.type === SurveyEnumType.MULTIPLE_CHOICE &&
        checkIfDurationExceeded(
          survey?.settings?.delivery?.startAt,
          survey?.settings?.delivery?.durationDays,
        ),
    ) || []

  const likeDislikeSurveys =
    surveys?.filter(
      (survey: Survey) =>
        survey.type === SurveyEnumType.LIKE_DISLIKE &&
        checkIfDurationExceeded(
          survey?.settings?.delivery?.startAt,
          survey?.settings?.delivery?.durationDays,
        ),
    ) || []

  const openEndedSurveys =
    surveys?.filter(
      (survey: Survey) =>
        survey.type === SurveyEnumType.OPEN_ENDED &&
        checkIfDurationExceeded(
          survey?.settings?.delivery?.startAt,
          survey?.settings?.delivery?.durationDays,
        ),
    ) || []

  const stickerAnnouncements =
    announcements?.filter(
      (announcement: Announcement) =>
        announcement.type === AnnouncementEnumType.STICKER,
    ) || []

  return (
    <>
      {ratingSurveys.map((survey: Survey) =>
        survey?.settings?.invite?.enabled ? (
          <InviteDialog
            key={survey._id}
            invite={survey?.settings?.invite}
            survey={survey}
            id={uuidv4().toString()}
          />
        ) : (
          <RatingDialog
            key={survey._id}
            survey={survey}
            id={uuidv4().toString()}
          />
        ),
      )}

      {multipleChoiceSurveys.map((survey: Survey) => (
        <MultipleChoiceDialog
          key={survey._id}
          survey={survey}
          id={uuidv4().toString()}
        />
      ))}

      {likeDislikeSurveys.map((survey: Survey) => (
        <LikeDislikeDialog
          key={survey._id}
          survey={survey}
          id={uuidv4().toString()}
        />
      ))}

      {openEndedSurveys.map((survey: Survey) =>
        survey?.settings?.invite?.enabled ? (
          <InviteDialog
            key={survey._id}
            invite={survey?.settings?.invite}
            survey={survey}
            id={uuidv4().toString()}
          />
        ) : (
          <OpenEndedDialog
            key={survey._id}
            survey={survey}
            id={uuidv4().toString()}
          />
        ),
      )}

      {!isLoading && <AnnouncementDialog id={uuidv4().toString()} />}

      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Join Neutrix Chat Room"
        subtitle="This is cool subtitle"
      />
    </>
  )
}

const useSurveys = () =>
  useQuery({
    queryKey: [SURVEYS],
    queryFn: () => getSurveys().then((res) => res.data.data),
  })

const useAnnouncements = () =>
  useQuery({
    queryKey: [ANNOUNCEMENTS],
    queryFn: () => getAnnouncements().then((res) => res.data.data),
  })
