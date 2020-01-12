export default () => {
  // eslint-disable-next-line  no-restricted-globals
  self.addEventListener("message", e => {
    if (!e) return;

    const typedArray = new Uint8Array(e.data);

    const untypedArrray = [];
    const iii = typedArray.values();
    let percentLevel = 1;
    let processLevel = 0;
    while (true) {
      const { value, done } = iii.next();
      processLevel = processLevel + 1;

      if (done) {
        break;
      }

      const hexValue = value.toString(16);

      untypedArrray.push(hexValue.length === 1 ? `0${hexValue}` : hexValue);

      if ((processLevel / typedArray.length) * 100 > percentLevel) {
        postMessage({
          processLevel: percentLevel,
          untypedArrray: []
        });
        percentLevel = percentLevel + 1;
      }
    }

    postMessage({ processLevel: percentLevel, untypedArrray });
  });
};
