const crypto = require("crypto");

// Define the key and IV (must be the same for encryption and decryption)
const KEY = "0123456789"; 
const IV = "12345"; 

// Encrypt a message
function encryptMessage(message) {
  console.log("Encrypting message:", message); // Log the plaintext
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, IV);
  const encrypted = cipher.update(message) + cipher.final("hex");
  console.log("Encrypted message:", encrypted); // Log the encrypted data
  return encrypted;
}

// Decrypt a message
function decryptMessage(encryptedMessage) {
  console.log("Decrypting message:", encryptedMessage); // Log the input
  const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, IV);
  const decrypted =
    decipher.update(encryptedMessage, "hex", "utf8") + decipher.final("utf8");
  console.log("Decrypted message:", decrypted); // Log the decrypted data
  return decrypted;
}

module.exports = { encryptMessage, decryptMessage };
