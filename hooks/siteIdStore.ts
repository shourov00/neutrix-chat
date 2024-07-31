import { atom } from 'jotai/index'
import { createStore } from 'jotai'

export const siteIdAtom = atom<string>('')

const store = createStore()

export const setSiteIdAtom = (siteId: string) => {
  store.set(siteIdAtom, siteId)
}

export const getSiteIdAtom = () => {
  return store.get(siteIdAtom)
}
