"use client";

export const debounce = (
  callback: (...args: unknown[]) => unknown,
  interval: number = 500,
  options: { trailing?: boolean; leading?: boolean } = {
    trailing: true,
    leading: false,
  }
) => {
  let timer: NodeJS.Timeout | undefined;
  const { trailing, leading } = options;

  return (...args: unknown[]) => {
    if (leading && !timer) {
      callback(...args);
    }
    clearTimeout(timer);

    timer = setTimeout(() => {
      if (trailing) {
        callback(...args);
      }
      timer = undefined;
    }, interval);
  };
};

export const throttle = (
  callback: (...args: unknown[]) => unknown,
  interval: number = 500,
  options: { trailing?: boolean } = {
    trailing: true,
  }
) => {
  let lastTime = 0;
  let timer: NodeJS.Timeout | undefined;
  const { trailing } = options;

  return (...args: unknown[]) => {
    const currentTime = Date.now();
    const remainingTime = interval - (currentTime - lastTime);

    if (remainingTime <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      callback(...args);
      lastTime = Date.now();
    } else if (trailing && !timer) {
      timer = setTimeout(() => {
        callback(...args);
        lastTime = Date.now();
        timer = undefined;
      }, remainingTime);
    }
  };
};
