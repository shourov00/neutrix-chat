import { atom } from 'jotai'

const dialogQueueAtom = atom<string[]>([])
export const currentDialogAtom = atom<string | null>(null)

export const openDialogAtom = atom(
  (get) => get(currentDialogAtom),
  (get, set, dialogId: string) => {
    const queue = get(dialogQueueAtom)
    if (!queue.includes(dialogId)) {
      set(dialogQueueAtom, [...queue, dialogId])
    }
    set(currentDialogAtom, dialogId)
    console.log(get(dialogQueueAtom))
  },
)

export const closeDialogAtom = atom(null, (get, set) => {
  const currentDialog = get(currentDialogAtom)
  const queue = get(dialogQueueAtom).filter(
    (dialog) => dialog !== currentDialog,
  )
  set(dialogQueueAtom, queue)
  if (queue.length > 0) {
    set(currentDialogAtom, queue[0])
  } else {
    set(currentDialogAtom, null)
  }
})
