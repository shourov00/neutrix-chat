import React, { useCallback, useEffect } from 'react'
import { addResponseMessage, Widget } from 'react-chat-widget'
import './global.css'
import 'react-chat-widget/lib/styles.css'
import { Survey, SurveyEnumType } from '@/src/models/surveyModels'
import InviteDialog from '@/src/components/InviteDialog'
import RatingDialog from '@/src/components/RatingDialog'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { addVisitor, getSiteData } from '@/api'
import AnnouncementLightboxDialog from '@/src/components/AnnouncementLightboxDialog'
import { useVisitorSession } from '@/hooks/useVisitorSession'
import { generateUniqueVisitorName } from '@/utils/visitor.utils'

interface props {
  siteId: string
}

export default function App({ siteId }: props) {
  const { data, isLoading } = useSiteData()
  const [dialogs, setDialogs] = React.useState<React.JSX.Element[]>([])
  const { value } = useVisitorSession()

  const addNewVisitor = useCallback(() => {
    return addVisitor({
      ...generateUniqueVisitorName(),
      lastSessionId: value,
      siteId,
      blocked: false,
      locale: [navigator.language],
      mood: 25,
      starred: false,
      visits: 1,
      url: {
        ...window.location,
      },
    })
  }, [siteId, value])

  const { mutate: addVisitorMutation } = useMutation({
    mutationFn: addNewVisitor,
    onError: (error) => {
      console.log(error)
    },
  })

  useEffect(() => {
    addResponseMessage('Welcome')
    setSiteIdAtom(siteId)
  }, [siteId, value])

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`)
  }

  useEffect(() => {
    if (!isLoading && data) {
      addVisitorMutation()

      const surveys = data?.surveys || []
      const announcements = data?.announcements || []

      const ratingSurveys = filterSurveys(SurveyEnumType.RATING, surveys)
      const multipleChoiceSurveys = filterSurveys(
        SurveyEnumType.MULTIPLE_CHOICE,
        surveys,
      )
      const likeDislikeSurveys = filterSurveys(
        SurveyEnumType.LIKE_DISLIKE,
        surveys,
      )
      const openEndedSurveys = filterSurveys(SurveyEnumType.OPEN_ENDED, surveys)

      const stickerAnnouncements = filterAnnouncements(
        AnnouncementEnumType.STICKER,
        announcements,
      )
      const lightboxAnnouncements = filterAnnouncements(
        AnnouncementEnumType.LIGHTBOX,
        announcements,
      )

      // to prevent multiple re-rendering add the models in a state and render queue based.
      const newDialogs = [
        ...renderSurveyDialogs(ratingSurveys, RatingDialog),
        ...renderSurveyDialogs(multipleChoiceSurveys, MultipleChoiceDialog),
        ...renderSurveyDialogs(likeDislikeSurveys, LikeDislikeDialog),
        ...renderSurveyDialogs(openEndedSurveys, OpenEndedDialog),
        ...renderAnnouncementsDialogs(
          stickerAnnouncements,
          AnnouncementStickerDialog,
        ),
        ...renderAnnouncementsDialogs(
          lightboxAnnouncements,
          AnnouncementLightboxDialog,
        ),
      ]

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
        id={uuidv4()}
      />
    ) : (
      <DialogComponent key={survey._id} survey={survey} id={uuidv4()} />
    ),
  )
}

const renderAnnouncementsDialogs = (
  announcements: Announcement[],
  DialogComponent: React.FC<any>,
) => {
  return announcements.map((announcement: Announcement) => (
    <DialogComponent
      key={announcement._id}
      announcement={announcement}
      id={uuidv4()}
    />
  ))
}

const useSiteData = () =>
  useQuery({
    queryKey: [SITE_DATA],
    queryFn: () => getSiteData().then((res) => res.data.data),
  })
