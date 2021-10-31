const Aop = {
  around(pointcut, advice, namespaces) {
    for (const key in namespaces) {
      const ns = namespaces[key];
      for (const member in ns) {
        if (typeof ns[member] === 'function' && member === pointcut) {
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
  before(pointcut, advice, namespaces) {
    function beforeAdvice(targetInfo) {
      advice.apply(this, targetInfo.args);
      return Aop.next.call(this, targetInfo);
    }

    Aop.around(pointcut, beforeAdvice, namespaces);
  },
  after(pointcut, advice, namespaces) {
    function afterAdvice(targetInfo) {
      const ret = Aop.next.call(this, targetInfo);
      advice.apply(this, targetInfo.args);
      return ret;
    }

    Aop.around(pointcut, afterAdvice, namespaces);
  },
  asyncAfterThrowing(pointcut, advice, namespaces) {
    async function asyncAfterThrowingAdvice(targetInfo) {
      try {
        const ret = await Aop.next.call(this, targetInfo);
        return ret;
      } catch (e) {
        return advice.apply(this, targetInfo.args);
      }
    }

    Aop.around(pointcut, asyncAfterThrowingAdvice, namespaces);
  },
};

export default Aop;
