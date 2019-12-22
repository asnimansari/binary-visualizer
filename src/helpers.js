function getBigInt64(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getBigInt64();
}

function getBigUint64(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getBigUint64();
}

function getFloat32(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getFloat32();
}

function getFloat64(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getFloat64();
}

function getInt16(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getInt16();
}

function getUint16(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getUint16();
}

function getUint32(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getUint32();
}

function getUint8(binaryArrayBuffer) {
  return new DataView(binaryArrayBuffer).getUint8();
}

// TODO Impliment Uint64
// Refer https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView

export const littleEndianFunctionalMap = {
  BigInt64: getBigInt64,
  BigUint64: getBigUint64,
  Float32: getFloat32,
  Float64: getFloat64,
  Int16: getInt16,
  Uint16: getUint16,
  Uint32: getUint32,
  Uint8: getUint8
};

export const lengthValidators = {
  BigInt64: buffer => buffer.length === 8,
  BigUint64: buffer => buffer.length === 8,
  Float32: buffer => buffer.length === 4,
  Float64: buffer => buffer.length === 8,
  Int16: buffer => buffer.length === 2,
  Uint16: buffer => buffer.length === 2,
  Uint32: buffer => buffer.length === 4,
  Uint8: buffer => buffer.length === 1
};

const machineEndianess = (function() {
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256 ? "little" : "big";
})();

const isLitteEndianMachine = machineEndianess === "little";
const isBigEndianMachine = !isLitteEndianMachine;
