function throttle<T extends (...args: any[]) => void>(fn: T, limit: number) {
  let inThrottle: boolean;
  let lastFn: ReturnType<typeof setTimeout>;
  let lastTime: number;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= limit) {
            fn.apply(context, args);
            lastTime = Date.now();
          }
        },
        limit - (Date.now() - lastTime)
      );
    }
  };
}
export default throttle;
