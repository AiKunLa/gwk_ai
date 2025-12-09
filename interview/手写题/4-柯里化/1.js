function curry(fn) {
  const argLength = fn.length;
  function _curry(...args) {
    if (args.length >= argLength) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return _curry.apply(this, args.concat(nextArgs));
    };
  }
  return _curry;
}
