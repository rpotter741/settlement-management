import ConfirmToast from './ConfirmToast';
import UndoToast from './UndoToast';

export { ConfirmToast, UndoToast };

const toastMap = {
  undo: UndoToast,
  confirm: ConfirmToast,
};

export default toastMap;
