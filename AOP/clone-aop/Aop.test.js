import Aop from './Aop.js';

describe('davedx/aop', () => {
  const targetPoint = 'target.fn 🎯';
  const notCalledTargetPoint = 'target.notCalledfn 👻';
  const returnedTargetValue = 'arget value 🎯';
  const advicePoint = 'advice 😻';

  let target = {};
  let executionPoints = [];
  let passedArgs = [];

  beforeEach(() => {
    executionPoints = [];
    passedArgs = [];

    target = {
      fn(...args) {
        executionPoints.push(targetPoint);
        passedArgs = args;
        return returnedTargetValue;
      },
      notCalledfn(...args) {
        executionPoints.push(notCalledTargetPoint);
        passedArgs = args;
        return returnedTargetValue;
      },
    };
  });

  function advice(...args) {
    passedArgs = args;
    executionPoints.push(advicePoint);
  }

  function advice2(...args) {
    passedArgs = args;
    executionPoints.push(advicePoint + '2');
  }

  function errorAdvice() {
    executionPoints.push('error 💩');
    throw new Error('👻');
  }

  describe('Aop.around(pointcut, advice, namespaces)', () => {
    it('타깃함수를 호출하면, advice가 실행된다', () => {
      Aop.around('fn', advice, [target]);
      target.fn();
      expect(executionPoints).toEqual([advicePoint]);
    });

    it('pointcut 과 매칭되는 타깃함수만 advice가 실행된다', () => {
      Aop.around('fn', advice, [target]);
      target.fn();
      expect(executionPoints).toEqual([advicePoint]);
    });

    it('모든 namespace 에 타깃함수를 호출하면, advice가 실행된다', () => {
      const otherTarget = {
        fn() {},
        other() {},
      };
      Aop.around('fn', advice, [target, otherTarget]);
      target.fn();
      otherTarget.fn();
      expect(executionPoints).toEqual([advicePoint, advicePoint]);
    });

    it('advice 가 타깃함수를 래핑할 수 있다', () => {
      const wrappingAdvice = (targetInfo) => {
        executionPoints.push('wrappingAdvice 🍹');
        targetInfo.fn();
        executionPoints.push('wrappingAdvice 🍹🍹');
      };

      Aop.around('fn', wrappingAdvice, [target]);
      target.fn();
      expect(executionPoints).toEqual([
        'wrappingAdvice 🍹',
        targetPoint,
        'wrappingAdvice 🍹🍹',
      ]);
    });

    it('advice 에서 타깃함수로 인자를 넘길 수 있다', () => {
      function advice(targetInfo) {
        return targetInfo.fn.apply(this, targetInfo.args);
      }

      Aop.around('fn', advice, [target]);
      target.fn('🍭', '🍋');

      expect(['🍭', '🍋']).toEqual(passedArgs);
    });

    describe('타깃함수는 타깃객체 컨텍스트에서 실행된다', () => {
      function advice({ fn, args }) {
        passedArgs = args;
        executionPoints.push(advicePoint);
        return fn.apply(this, args);
      }

      describeContext(Aop, advice);
    });
  });

  describe('Aop.next(targetInfo)', () => {
    function advice(targetInfo) {
      return Aop.next.call(this, targetInfo);
    }

    beforeEach(() => {
      Aop.around('fn', advice, target);
    });

    it('targetInfo.fn 을 호출한다', () => {
      target.fn();
      expect(executionPoints).toEqual([targetPoint]);
    });

    it('targetInfo.args 에 인자를 전달한다', () => {
      target.fn('🍭', '🍋');
      expect(passedArgs).toEqual(['🍭', '🍋']);
    });

    it('targetInfo.fn 의 값을 반환한다', () => {
      const ret = target.fn();
      expect(ret).toBe(returnedTargetValue);
    });

    describe('타깃함수는 타깃객체 컨텍스트에서 실행된다', () => {
      function advice({ fn, args }) {
        passedArgs = args;
        executionPoints.push(advicePoint);
        return fn.apply(this, args);
      }

      describeContext(Aop, advice);
    });
  });
});

function describeContext(Aop, advice) {
  class Fruit {
    constructor() {
      this.self = this;
    }
    getFruit() {
      expect(this).toBe(this.self);
    }
  }

  const Book = {
    my() {
      return this;
    },
    getBook() {
      expect(this).toBe(this.my());
    },
  };

  it('Class', () => {
    const fruitInstance = new Fruit();
    const spy = jest.spyOn(fruitInstance, 'getFruit').mockImplementation();
    Aop.around('getFruit', advice, [fruitInstance]);

    fruitInstance.getFruit();
    expect(spy).toHaveBeenCalled();
  });
  it('Object', () => {
    const bookInstance = Book;
    const spy = jest.spyOn(bookInstance, 'getBook').mockImplementation();
    Aop.around('getBook', advice, [bookInstance]);

    bookInstance.getBook();

    expect(spy).toHaveBeenCalled();
  });
}
