import Aop from '../Aop.js';
import orderService from '../target/orderService.js';

export default function LoggerAspect() {
  return {
    advice(info) {
      console.log(`로그 찍습니다 : ${info}`);
    },
    async asyncAdvice(info) {
      await console.log(`비동기 로그 찍습니다 : ${info}`);
    },
  };
}

const logger = LoggerAspect();

Aop.before('order', logger.advice, [orderService]);
Aop.after('order', logger.advice, [orderService]);
Aop.asyncAfterThrowing('orderInfo', logger.asyncAdvice, [orderService]);
