function makeSnackbarMessage({
  message,
  type,
  duration = 3000,
  rollback,
  rollbackAction,
}: {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  rollback?: any;
  rollbackAction?: (rollback: any) => void;
}) {
  return {
    message,
    type,
    duration,
  };
}

export default makeSnackbarMessage;
