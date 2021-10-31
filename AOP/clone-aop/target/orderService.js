function fetchInfo(requestInfo) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      rej('NOT_PERMISSION');
    }, 500);
  });
}

export default {
  order(name) {
    console.log(`핵심 로직이 실행되고 있어요. orderService.order()`);
  },
  async orderInfo(requestInfo) {
    console.log(
      `핵심 로직이 실행되고 있어요. orderService.orderInfo() - start`
    );
    await fetchInfo(requestInfo);
    console.log(`핵심 로직이 실행되고 있어요. orderService.orderInfo() - end`);
  },
};
