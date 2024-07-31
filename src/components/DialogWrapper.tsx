import { Dialog } from '@radix-ui/react-dialog'
import React, { useEffect } from 'react'
import { useDialog } from '@/hooks/useDialog'
import { useAtom } from 'jotai/index'
import { currentDialogAtom } from '@/hooks/dialogAtoms'

interface DialogProps {
  id: string
  children: React.ReactNode
}

const DialogWrapper = ({ id, children }: DialogProps) => {
  const [currentDialog] = useAtom(currentDialogAtom)
  const { close, open } = useDialog()
  const isOpen = currentDialog === id

  useEffect(() => {
    open(id)
  }, [id])

  return (
    <>
      {currentDialog && (
        <Dialog open={isOpen} onOpenChange={close} modal={false}>
          {children}
        </Dialog>
      )}
    </>
  )
}

export default DialogWrapper
