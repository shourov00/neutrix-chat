import { useAtom } from 'jotai/index'
import { atom } from 'jotai'

const visitorIdAtom = atom('')

export function useVisitorId() {
  return useAtom(visitorIdAtom)
}
