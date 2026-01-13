type ThunkContext = {
  dispatch: any;
  getState: any;
};

type RollbackConfig = {
  keypath: string;
  previousValue: any;
};

interface WrapThunkOptions<Args = any, Return = any> {
  debug?: boolean;
  errorMessage?: string;
  onSuccess?: (result: Return, args: Args, context: ThunkContext) => void;
  onFailure?: (error: Error, args: Args, context: ThunkContext) => void;
  rollback?: RollbackConfig;
}

export function wrapThunk<Args, Return>(
  fn: (args: Args, context: ThunkContext) => Promise<Return>,
  options: WrapThunkOptions<Args, Return> = {}
) {
  return async (args: Args, thunkAPI: ThunkContext) => {
    const { dispatch, getState } = thunkAPI;

    try {
      if (options.debug) {
      }

      const result = await fn(args, { dispatch, getState });

      if (options.onSuccess) {
        options.onSuccess(result, args, { dispatch, getState });
      }

      return result;
    } catch (err: any) {
      const error = new Error(
        err?.response?.data?.message ||
          err?.message ||
          options.errorMessage ||
          'Unknown error'
      );

      if (options.debug) {
        console.error('[wrapThunk] error:', error.message);
      }

      // === Optional rollback behavior ===
      if (options.rollback) {
        const { keypath, previousValue } = options.rollback;
        dispatch({
          type: 'ROLLBACK_STATE',
          payload: { keypath, value: previousValue },
        });
      }

      // === Optional failure callback ===
      if (options.onFailure) {
        options.onFailure(error, args, { dispatch, getState });
      }

      throw error;
    }
  };
}
