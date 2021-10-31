import Aop from './Aop.js';
import LoggerAspect from './aspects/LoggerAspect.js';
import orderService from './target/orderService.js';

orderService.order('ordered 🎁');
orderService.orderInfo('request info');
