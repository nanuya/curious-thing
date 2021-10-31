🎯 목표설정

- AOP 에 대한 이해도 높이기
  - [davedx/aop](https://github.com/davedx/aop/blob/master/aop.js) 의 라이브러리를 클론 코딩 및 테스팅 해보면서 분석하기

<br />

# 관점 지향 프로그래밍(Aspect-oriented programming, AOP)

`AOP`란, 로깅, 캐싱, 혹은 인증과 같은 `횡단 관심사(croww-cutting concerns)`를 `핵심로직`과 분리하는 프로그래밍 기법이다.

## 🔸 why AOP?

&nbsp; &nbsp; &nbsp; 최근에 프레임워크 없이 자바스크립트로 개발하는 프로젝트와 릴리즈를 2달 앞둔 프로젝트에 참여하게 됐다. (...핑계지만) 시간에 쫓기며 참여하다보니 핵심로직과 부가로직이 마구 섞이는 결과물을 탄생 시켰다...🙀 그 코드들을 보면서, 예전에 동생이 얘기해준 `AOP` 가 떠올랐다.

<br />

#### 핵심로직과 부가로직이 섞였다?

```js
// aspect 사용 전

const orderService = {
  order(name) {
    logger('주문 시작');
    // ...핵심 로직
    logger('주문 완료');
  },
  async orderInfo(requestInfo) {
    try {
      // ...핵심 로직
    } catch (e) {
      logger('정보 호출 실패');
    }
  },
};
```

&nbsp; &nbsp; &nbsp; `orderService`를 보면, 각 `method`를 호출할 때 상황에 맞는 로그를 남기는 코드가 존재한다. `주문하기` 와 `주문정보 조회` 와 직접적 관계가 없는 `로그 남기기` 가 서로 섞여있는 것이다. 이 때, 횡단 관삼사인 `로그 남기기`는 `LoggerAspect`라는 독립적인 모듈로 분리할 수 있다.

#### 완벽히(?) 분리하기

```js
function LoggerAspect() {
  return {
    advice(info) {
      console.log(`로그 찍습니다 : ${info}`);
    },
    async asyncAdvice(info) {
      await console.log(`비동기 로그 찍습니다 : ${info}`);
    },
  };
}
```

이와 같이 `aspect` 를 만들고, `orderService.order` 가 호출 될 때 `logger.advice` 로 대체될 수 있도록 등록만 해주면 **핵심로직과 부가로직을 완벽히 분리 :+1:** 할 수 있다.

```js
const logger = LoggerAspect();

Aop.before('order', logger.advice, [orderService]);
Aop.after('order', logger.advice, [orderService]);
Aop.asyncOnThrow('orderInfo', logger.asyncAdvice, [orderService]);
```

```js
// aspect 사용 후

const orderService = {
  order(name) {
    // ...핵심 로직
  },
  async orderInfo(requestInfo) {
    // ...핵심 로직
  },
};
```

> 미래의 내가 `CacheAspect`, `AuthAspect` 등도 만들겠지... 🌬️

<br />

<br />

## 🔸 용어 정리

#### advice

- 부가기능의 구현체로 `aspect`가 `무엇`을 `언제` 할지 정의

#### joinpoint

- `advice`를 적용할 수 있는 곳

#### pointcut

- `aspect`가 `advice`할 `joinpoint`의 영역을 특정함
- `aspect`가 `어디서` 할지 정의

#### aspect

- `avice`와 `pointcut`을 가지고 있으며, 부가기능을 분리한 하나의 모듈

<br />

<br />

<br />

#### Reference

- [관점 지향 프로그래밍](https://ko.wikipedia.org/wiki/%EA%B4%80%EC%A0%90_%EC%A7%80%ED%96%A5_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D), 위키백과
- [davedx/aop](https://github.com/davedx/aop/blob/master/aop.js), Dave Clayton, 2015
- [An introduction to Aspect-Oriented Programming](https://medium.com/@blueish/an-introduction-to-aspect-oriented-programming-5a2988f51ee2), Coda, 2019
- [Aspect Oriented Programming in TypeScript](https://www.meziantou.net/aspect-oriented-programming-in-typescript.htm), Gérald Barré, 2018
- [Jest docs](https://jestjs.io/docs/mock-function-api#mockfnmockimplementationfn)
