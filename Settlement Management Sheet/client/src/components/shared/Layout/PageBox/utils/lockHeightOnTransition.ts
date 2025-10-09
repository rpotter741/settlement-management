const lockHeightDuringTransition = (
  ref: any,
  timer: any,
  setHeight: (height: number | 'auto') => void,
  duration: number = 300
) => {
  if (ref.current) {
    const measuredHeight = ref.current.offsetHeight;
    setHeight(measuredHeight);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setHeight('auto');
    }, duration); // Adjust the timeout duration as needed
  }
};

export default lockHeightDuringTransition;
