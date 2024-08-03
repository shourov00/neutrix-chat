import { useMutation } from '@tanstack/react-query'
import { VisitorResponse } from '@/src/models/responseModels'
import { addVisitorResponse } from '@/api'
import { useVisitorId } from '@/hooks/useVisitorId'

export const useAddVisitorResponse = (siteId: string) => {
  const [visitorId] = useVisitorId()
  return useMutation({
    mutationFn: async (values: VisitorResponse) => {
      return await addVisitorResponse({
        siteId,
        visitor: visitorId,
        ...values,
      })
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
