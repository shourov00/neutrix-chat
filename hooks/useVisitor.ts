import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai/index'
import { v4 as uuidv4 } from 'uuid'
import { generateUniqueVisitorName } from '@/utils/visitor.utils'

const visitorConfig = {
  ...generateUniqueVisitorName(),
  id: '',
  email: '',
  chatId: '',
  lastSessionId: uuidv4(),
  chatRating: 0,
}

const visitorAtom = atomWithStorage('visitor', visitorConfig)

export function useVisitor() {
  return useAtom(visitorAtom)
}
