const syncReducerState = (
  reducerState: any,
  globalState: any,
  keys: string[]
) => {
  const newState: any = { ...reducerState };
  keys.forEach((key) => {
    if (globalState.hasOwnProperty(key) && globalState[key] !== undefined) {
      newState[key] = globalState[key];
    }
  });
  return newState;
};
export default syncReducerState;
