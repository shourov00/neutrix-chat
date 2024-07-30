import { atom, useAtom } from 'jotai/index'

const siteId = atom('')

export function useSiteId() {
  return useAtom(siteId)
}
