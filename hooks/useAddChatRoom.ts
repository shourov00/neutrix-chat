import { useMutation } from '@tanstack/react-query'
import { addVisitorChat, updateVisitor } from '@/api'
import { useVisitor } from '@/hooks/useVisitor'
import { getSiteIdAtom } from './siteIdStore'
import { ChatMessage } from '@/models/chatModels'

interface Props {
  onSendMessage: (message: ChatMessage) => void
}

export const useAddChatRoom = ({ onSendMessage }: Props) => {
  const [visitor, setVisitor] = useVisitor()

  const { mutate: updateVisitorInfo } = useMutation({
    mutationFn: async (values: any) => {
      return await updateVisitor(visitor.id, values)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  return useMutation({
    mutationFn: async (values: any) => {
      const response = await addVisitorChat({
        siteId: getSiteIdAtom(),
        visitor: visitor.id,
        status: 'active',
      })
      const chatId = response?.data?.data?._id
      setVisitor({
        ...visitor,
        ...values,
        chatId,
      })
      updateVisitorInfo({
        name: values.name,
        email: values.email,
      })
      onSendMessage({
        siteId: getSiteIdAtom(),
        status: 'sent',
        chatId,
        content: values.content,
        messageType: 'text',
        senderId: visitor.id,
        name: values.name,
        createdAt: new Date(),
      })
      return response
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
