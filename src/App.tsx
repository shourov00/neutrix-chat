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
import AnnouncementStickerDialog from '@/src/components/AnnouncementStickerDialog'
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
import AnnouncementLightboxDialog from '@/src/components/AnnouncementLightboxDialog'
import { useVisitorSession } from '@/hooks/useVisitorSession'
import { VisitorResponse } from '@/src/models/responseModels'
import { useAddVisitor } from '@/hooks/useAddVisitor'
import { useAddVisitorResponse } from '@/hooks/useAddVisitorResponse'

interface props {
  siteId: string
}

export default function App({ siteId }: props) {
  const { data, isLoading } = useSiteData()
  const [dialogs, setDialogs] = React.useState<React.JSX.Element[]>([])
  const { value: sessionId } = useVisitorSession()

  const { mutate: addVisitorMutation } = useAddVisitor(siteId, sessionId)
  const { mutate: addVisitorResponseMutation } = useAddVisitorResponse(siteId)

  useEffect(() => {
    addResponseMessage('Welcome')
    setSiteIdAtom(siteId)
  }, [siteId, sessionId])

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`)
  }

  useEffect(() => {
    if (!isLoading && data) {
      addVisitorMutation()

      const newDialogs = generateDialogs(data, addVisitorResponseMutation)
      setDialogs(newDialogs)
    }
  }, [isLoading, data])

  return (
    <>
      {dialogs}

      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Join Neutrix Chat Room"
        subtitle="This is cool subtitle"
      />
    </>
  )
}

const generateDialogs = (
  data: any,
  addVisitorResponseMutation?: (response: VisitorResponse) => void,
): React.JSX.Element[] => {
  const surveys = data?.surveys || []
  const announcements = data?.announcements || []

  const dialogs: React.JSX.Element[] = [
    ...renderSurveyDialogs(
      SurveyEnumType.RATING,
      surveys,
      RatingDialog,
      addVisitorResponseMutation,
    ),
    ...renderSurveyDialogs(
      SurveyEnumType.MULTIPLE_CHOICE,
      surveys,
      MultipleChoiceDialog,
      addVisitorResponseMutation,
    ),
    ...renderSurveyDialogs(
      SurveyEnumType.LIKE_DISLIKE,
      surveys,
      LikeDislikeDialog,
      addVisitorResponseMutation,
    ),
    ...renderSurveyDialogs(
      SurveyEnumType.OPEN_ENDED,
      surveys,
      OpenEndedDialog,
      addVisitorResponseMutation,
    ),
    ...renderAnnouncementsDialogs(
      AnnouncementEnumType.STICKER,
      announcements,
      AnnouncementStickerDialog,
      addVisitorResponseMutation,
    ),
    ...renderAnnouncementsDialogs(
      AnnouncementEnumType.LIGHTBOX,
      announcements,
      AnnouncementLightboxDialog,
      addVisitorResponseMutation,
    ),
  ]

  return dialogs
}

const renderSurveyDialogs = (
  surveyType: SurveyEnumType,
  surveys: Survey[],
  DialogComponent: React.FC<any>,
  addVisitorResponseMutation?: (response: VisitorResponse) => void,
) => {
  const filteredSurveys = filterSurveys(surveyType, surveys)
  return filteredSurveys.map((survey: Survey) =>
    survey?.settings?.invite?.enabled ? (
      <InviteDialog
        key={survey._id}
        invite={survey?.settings?.invite}
        survey={survey}
        id={uuidv4()}
        handleResponse={addVisitorResponseMutation}
      />
    ) : (
      <DialogComponent
        key={survey._id}
        survey={survey}
        id={uuidv4()}
        handleResponse={addVisitorResponseMutation}
      />
    ),
  )
}

const renderAnnouncementsDialogs = (
  announcementType: AnnouncementEnumType,
  announcements: Announcement[],
  DialogComponent: React.FC<any>,
  addVisitorResponseMutation?: (response: VisitorResponse) => void,
) => {
  const filteredAnnouncements = filterAnnouncements(
    announcementType,
    announcements,
  )
  return filteredAnnouncements.map((announcement: Announcement) => (
    <DialogComponent
      key={announcement._id}
      announcement={announcement}
      id={uuidv4()}
      handleResponse={addVisitorResponseMutation}
    />
  ))
}

const useSiteData = () =>
  useQuery({
    queryKey: [SITE_DATA],
    queryFn: () => getSiteData().then((res) => res.data.data),
  })
