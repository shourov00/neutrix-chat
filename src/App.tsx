import React, { useEffect } from 'react'
import { useSiteId } from '@/hooks/useSiteId'
import { addResponseMessage, Widget } from 'react-chat-widget'
import './global.css'
import 'react-chat-widget/lib/styles.css'
import { Survey, SurveyEnumType } from '@/src/models/surveyModels'
import InviteDialog from '@/src/components/InviteDialog'
import RatingDialog from '@/src/components/RatingDialog'
import { useQuery } from '@tanstack/react-query'
import { SURVEYS } from '@/api/types'
import { getSurveys } from '@/api/surveys'
import { v4 as uuidv4 } from 'uuid'
import AnnouncementDialog from '@/src/components/AnnouncementDialog'
import MultipleChoiceDialog from '@/src/components/MultipleChoiceDialog'

interface props {
  siteId: string
}

export default function App({ siteId }: props) {
  const [, setSiteId] = useSiteId()
  // todo remove hardcoded siteid
  const { data: surveys, error, isLoading } = useSurveys('123123123')

  useEffect(() => {
    addResponseMessage('Welcome')
    setSiteId(siteId)
  }, [siteId])

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`)
    // Now send the message through the backend API
  }

  console.log(surveys)

  const ratingSurveys =
    surveys?.filter(
      (survey: Survey) => survey.type === SurveyEnumType.RATING,
    ) || []

  const multipleChoiceSurveys =
    surveys?.filter(
      (survey: Survey) => survey.type === SurveyEnumType.MULTIPLE_CHOICE,
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

      {!isLoading && <AnnouncementDialog id={uuidv4().toString()} />}
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Join Neutrix Chat Room"
        subtitle="This is cool subtitle"
      />
    </>
  )
}

const useSurveys = (siteId: string) =>
  useQuery({
    queryKey: [SURVEYS],
    queryFn: () => getSurveys(siteId).then((res) => res.data.data),
  })
