import { useMutation } from '@tanstack/react-query'
import { VisitorResponse } from '@/src/models/responseModels'
import { addVisitorResponse } from '@/api'
import { useVisitor } from '@/hooks/useVisitor'

export const useAddVisitorResponse = (siteId: string) => {
  const [visitor] = useVisitor()
  return useMutation({
    mutationFn: async (values: VisitorResponse) => {
      return await addVisitorResponse({
        siteId,
        visitor: visitor.id,
        ...values,
      })
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
