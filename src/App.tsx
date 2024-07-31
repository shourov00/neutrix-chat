import React, { useEffect } from 'react'
import { addResponseMessage, Widget } from 'react-chat-widget'
import './global.css'
import 'react-chat-widget/lib/styles.css'
import { Survey, SurveyEnumType } from '@/src/models/surveyModels'
import InviteDialog from '@/src/components/InviteDialog'
import RatingDialog from '@/src/components/RatingDialog'
import { useQuery } from '@tanstack/react-query'
import { SITE_DATA } from '@/api/types'
import { v4 as uuidv4 } from 'uuid'
import AnnouncementDialog from '@/src/components/AnnouncementDialog'
import MultipleChoiceDialog from '@/src/components/MultipleChoiceDialog'
import LikeDislikeDialog from '@/src/components/LikeDislikeDialog'
import OpenEndedDialog from '@/src/components/OpenEndedDialog'
import { setSiteIdAtom } from '@/hooks/siteIdStore'
import { filterSurveys } from '@/utils/surveys.utils'
import { filterAnnouncements } from '@/utils/announcement.utils'
import {
  Announcement,
  AnnouncementEnumType,
} from '@/src/models/announcementModels'
import { getSiteData } from '@/api'

interface props {
  siteId: string
}

interface SiteData {
  surveys: Survey[]
  announcements: Announcement[]
}

export default function App({ siteId }: props) {
  const { data, isLoading } = useSiteData()

  useEffect(() => {
    addResponseMessage('Welcome')
    // TODO: remove hardcoded siteID
    setSiteIdAtom(siteId || '123123123')
  }, [siteId])

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`)
  }

  const surveys = data?.surveys || []
  const announcements = data?.announcements || []

  const ratingSurveys = filterSurveys(SurveyEnumType.RATING, surveys)
  const multipleChoiceSurveys = filterSurveys(
    SurveyEnumType.MULTIPLE_CHOICE,
    surveys,
  )
  const likeDislikeSurveys = filterSurveys(SurveyEnumType.LIKE_DISLIKE, surveys)
  const openEndedSurveys = filterSurveys(SurveyEnumType.OPEN_ENDED, surveys)

  const stickerAnnouncements = filterAnnouncements(
    AnnouncementEnumType.STICKER,
    announcements,
  )

  return (
    <>
      {renderSurveyDialogs(ratingSurveys, RatingDialog)}
      {renderSurveyDialogs(multipleChoiceSurveys, MultipleChoiceDialog)}
      {renderSurveyDialogs(likeDislikeSurveys, LikeDislikeDialog)}
      {renderSurveyDialogs(openEndedSurveys, OpenEndedDialog)}

      {!isLoading && <AnnouncementDialog id={uuidv4().toString()} />}

      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Join Neutrix Chat Room"
        subtitle="This is cool subtitle"
      />
    </>
  )
}

const renderSurveyDialogs = (
  surveys: Survey[],
  DialogComponent: React.FC<any>,
) => {
  return surveys.map((survey: Survey) =>
    survey?.settings?.invite?.enabled ? (
      <InviteDialog
        key={survey._id}
        invite={survey?.settings?.invite}
        survey={survey}
        id={uuidv4().toString()}
      />
    ) : (
      <DialogComponent
        key={survey._id}
        survey={survey}
        id={uuidv4().toString()}
      />
    ),
  )
}

const useSiteData = () =>
  useQuery({
    queryKey: [SITE_DATA],
    queryFn: () => getSiteData().then((res) => res.data.data),
  })
