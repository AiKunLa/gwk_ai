// 时间戳实现 节流，只少间隔delay时间执行一次
const throttle = (fn, delay) => {
  let later = 0;
  return function (...args) {
    const now = new Date();
    if (now - later >= delay) {
      fn.apply(this, args);
      later = now;
    }
  };
};

// 定时器实现
const throttle2 = (fn, delay) => {
  let timer = true;
  return function (...args) {
    if (!timer) return;
    setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 防抖
const throttle3 = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
