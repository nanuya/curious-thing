const Aop = {
  around(pointcut, advice, namespaces) {
    for (const key in namespaces) {
      const ns = namespaces[key];
      for (const member in ns) {
        if (typeof ns[member] === 'function' && member.match(pointcut)) {
          (function (fn, fnName, ns) {
            ns[member] = function () {
              return advice.call(this, { fn, fnName, args: arguments });
            };
          })(ns[member], member, ns);
        }
      }
    }
  },
  next(targetInfo) {
    return targetInfo.fn.apply(this, targetInfo.args);
  },
};

export default Aop;
