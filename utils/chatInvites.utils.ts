import { checkIfVisibleInCurrentPath } from './audience.utils'
import { VisitorResponse } from '@/models/responseModels'
import { ChatInvite, ChatInviteResponseProps } from '@/models/chatInviteModels'

export const filterChatInvites = (surveys: ChatInvite[]) => {
  return (
    surveys?.filter((chatInvite: ChatInvite) =>
      checkIfVisibleInCurrentPath(
        chatInvite?.settings?.audience,
        window.location.href,
      ),
    ) || []
  )
}

export const handleChatInviteResponse = ({
  status = 'completed',
  chatInvite,
  devices,
}: ChatInviteResponseProps): VisitorResponse => {
  return {
    responseId: chatInvite?._id,
    responseType: 'chat-invite',
    status,
    meta: {
      devices,
    },
  }
}
