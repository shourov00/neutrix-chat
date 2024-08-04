import { Dialog } from '@radix-ui/react-dialog'
import React, { useEffect } from 'react'
import { useDialog } from '@/hooks/useDialog'
import { useAtom } from 'jotai/index'
import { currentDialogAtom } from '@/hooks/dialogAtoms'

interface DialogProps {
  id: string
  modal?: boolean
  onClose?: () => void
  children: React.ReactNode
}

const DialogWrapper = ({
  id,
  modal = false,
  onClose,
  children,
}: DialogProps) => {
  const [currentDialog] = useAtom(currentDialogAtom)
  const { close, open } = useDialog()
  const isOpen = currentDialog === id

  useEffect(() => {
    open(id)
  }, [id])

  return (
    <>
      {currentDialog && (
        <Dialog
          open={isOpen}
          onOpenChange={() => {
            close()
            onClose && onClose()
          }}
          modal={modal}
        >
          {children}
        </Dialog>
      )}
    </>
  )
}

export default DialogWrapper
