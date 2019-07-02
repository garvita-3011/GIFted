const debounce = function (time) {
  return function debouncer (target, key, descriptor) {
    const originalFunction = descriptor.value;
    let timer;
    descriptor.value = function wrapper (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        originalFunction.apply(this, args);
      }, time);
    };
    return descriptor;
  };
};

export default debounce;
