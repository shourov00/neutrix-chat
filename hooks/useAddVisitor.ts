import { useMutation } from '@tanstack/react-query'
import { addVisitor } from '@/api'
import { useVisitor } from '@/hooks/useVisitor'

export const useAddVisitor = (siteId: string, value: string) => {
  const [visitor, setVisitor] = useVisitor()
  return useMutation({
    mutationFn: () =>
      addVisitor({
        name: visitor.name,
        color: visitor.color,
        fruit: visitor.fruit,
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
      setVisitor({
        ...visitor,
        id: data?.data?.data?._id,
      })
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
