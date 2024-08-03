import { useMutation } from '@tanstack/react-query'
import { addVisitor } from '@/api'
import { generateUniqueVisitorName } from '@/utils/visitor.utils'
import { useVisitorId } from '@/hooks/useVisitorId'

export const useAddVisitor = (siteId: string, value: string) => {
  const [, setVisitorId] = useVisitorId()
  return useMutation({
    mutationFn: () =>
      addVisitor({
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
      }),
    onSuccess: (data) => {
      setVisitorId(data?.data?.data?._id)
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
