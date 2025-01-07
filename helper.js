function encryptBuffer(buffer) {
  const result = Buffer.from(buffer); 
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== 255) {
      result[i] = result[i] + 1;
    }
  }
  return result;
}

function decryptBuffer(buffer) {
  const result = Buffer.from(buffer); 
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== 255) {
      result[i] = result[i] - 1;
    }
  }
  return result;
}

module.exports = { encryptBuffer, decryptBuffer };
