export default () => {
  // eslint-disable-next-line  no-restricted-globals
  self.addEventListener("message", e => {
    if (!e) return;

    const typedArray = new Uint8Array(e.data);

    postMessage({ typedArray });

    const hexStringArray = [];
    let completeHexString = "";
    const iii = typedArray.values();

    let index = 0;

    while (true) {
      const { value, done } = iii.next();

      if (done) {
        break;
      }
      const hexValue = value.toString(16);
      hexStringArray.push(hexValue.length === 1 ? `0${hexValue}` : hexValue);
      completeHexString = completeHexString + hexValue + " ";

      index = index + 1;
    }

    postMessage({ hexStringArray, completeHexString });
  });
};
