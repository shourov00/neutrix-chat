import { useAtom } from 'jotai';
import { openDialogAtom, closeDialogAtom, currentDialogAtom } from './dialogAtoms';

export const useDialog = () => {
  const [currentDialog] = useAtom(currentDialogAtom);
  const [, openDialog] = useAtom(openDialogAtom);
  const [, closeDialog] = useAtom(closeDialogAtom);

  const open = (dialogId: string) => {
    openDialog(dialogId);
  };

  const close = () => {
    closeDialog();
  };

  return {
    currentDialog,
    open,
    close,
  };
};
