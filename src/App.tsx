import React, { useEffect } from 'react'
import './global.css'
import { Survey, SurveyEnumType } from '@/models/surveyModels'
import InviteDialog from '@/src/components/InviteDialog'
import RatingDialog from '@/src/components/RatingDialog'
import { useQuery } from '@tanstack/react-query'
import { SITE_DATA } from '@/api/types'
import { v4 as uuidv4 } from 'uuid'
import AnnouncementStickerDialog from '@/src/components/AnnouncementStickerDialog'
import LikeDislikeDialog from '@/src/components/LikeDislikeDialog'
import OpenEndedDialog from '@/src/components/OpenEndedDialog'
import { setSiteIdAtom } from '@/hooks/siteIdStore'
import { filterSurveys } from '@/utils/surveys.utils'
import { filterAnnouncements } from '@/utils/announcement.utils'
import { Announcement, AnnouncementEnumType } from '@/models/announcementModels'
import { getSiteData } from '@/api'
import AnnouncementLightboxDialog from '@/src/components/AnnouncementLightboxDialog'
import { VisitorResponse } from '@/models/responseModels'
import { useAddVisitor } from '@/hooks/useAddVisitor'
import { useAddVisitorResponse } from '@/hooks/useAddVisitorResponse'
import MultipleChoiceDialog from '@/src/components/MultipleChoiceDialog'
import ChatInviteDialog from '@/src/components/ChatInviteDialog'
import ChatWidget from '@/src/components/chat-widget/ChatWidget'
import { useVisitor } from '@/hooks/useVisitor'
import { Toaster } from '@/src/components/ui/sonner'
import { ChatInvite } from '@/models/chatInviteModels'
import { filterChatInvites } from '@/utils/chatInvites.utils'
import { CompanyInfo } from '@/models/chatModels'

interface props {
  siteId: string
}

export default function App({ siteId }: props) {
  const [visitor] = useVisitor()
  const { data, isLoading } = useSiteData(visitor.id)
  const [dialogs, setDialogs] = React.useState<React.JSX.Element[]>([])
  const { mutate: addVisitorMutation } = useAddVisitor(
    siteId,
    visitor.lastSessionId,
  )
  const { mutate: addVisitorResponseMutation } = useAddVisitorResponse(siteId)
  const isChatLauncherActive = data?.chatSettings?.chat?.launcher?.active

  useEffect(() => {
    if (!localStorage.getItem('visitor')) {
      addVisitorMutation()
    }
  }, [])

  useEffect(() => {
    setSiteIdAtom(siteId)
  }, [siteId, visitor.lastSessionId])

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

      {isChatLauncherActive && (
        <ChatWidget
          chatSettings={data?.chatSettings}
          companyInfo={data?.companyInfo}
        />
      )}
      <Toaster position={'top-center'} />
    </>
  )
}

const generateDialogs = (
  data: any,
  addVisitorResponseMutation: (response: VisitorResponse) => void,
): React.JSX.Element[] => {
  const surveys = data?.surveys || []
  const announcements = data?.announcements || []
  const chatInvites = data?.chatInvites || []
  const companyInfo = data?.companyInfo || null

  return [
    ...renderChatInviteDialogs(
      chatInvites,
      companyInfo,
      ChatInviteDialog,
      addVisitorResponseMutation,
    ),
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
}

const renderSurveyDialogs = (
  surveyType: SurveyEnumType,
  surveys: Survey[],
  DialogComponent: React.FC<any>,
  addVisitorResponseMutation: (response: VisitorResponse) => void,
) => {
  const filteredSurveys = filterSurveys(surveyType, surveys)
  return filteredSurveys.map((survey: Survey) =>
    survey?.settings?.invite?.enabled ? (
      <InviteDialog
        id={uuidv4()}
        key={survey._id}
        invite={survey?.settings?.invite}
        survey={survey}
        handleResponse={addVisitorResponseMutation}
      />
    ) : (
      <DialogComponent
        id={uuidv4()}
        key={survey._id}
        survey={survey}
        handleResponse={addVisitorResponseMutation}
      />
    ),
  )
}

const renderAnnouncementsDialogs = (
  announcementType: AnnouncementEnumType,
  announcements: Announcement[],
  DialogComponent: React.FC<any>,
  addVisitorResponseMutation: (response: VisitorResponse) => void,
) => {
  const filteredAnnouncements = filterAnnouncements(
    announcementType,
    announcements,
  )
  return filteredAnnouncements.map((announcement: Announcement) => (
    <DialogComponent
      id={uuidv4()}
      key={announcement._id}
      announcement={announcement}
      handleResponse={addVisitorResponseMutation}
    />
  ))
}

const renderChatInviteDialogs = (
  chatInvites: ChatInvite[],
  companyInfo: CompanyInfo,
  DialogComponent: React.FC<any>,
  addVisitorResponseMutation: (response: VisitorResponse) => void,
) => {
  const filteredChatInvites = filterChatInvites(chatInvites)
  return filteredChatInvites.map((chatInvite: ChatInvite) => (
    <DialogComponent
      id={uuidv4()}
      key={chatInvite._id}
      chatInvite={chatInvite}
      companyInfo={companyInfo}
      handleResponse={addVisitorResponseMutation}
    />
  ))
}

const useSiteData = (visitorId: string) =>
  useQuery({
    queryKey: [SITE_DATA],
    enabled: !!visitorId,
    queryFn: () => getSiteData(visitorId).then((res) => res.data.data),
  })
