const net = require("net");
const readline = require("readline/promises");
const { encryptMessage } = require("./helper");

// Set up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let id; // User's unique ID

// Create a connection to the server
const socket = net.createConnection(
  { host: "127.0.0.1", port: 3000 },
  async () => {
    console.log("Connected to server...");

    // Function to ask for user input and send encrypted messages
    const ask = async () => {
      const message = await rl.question("Enter your message: ");

      // Encrypt the message before sending
      const encryptedMessage = encryptMessage(`${id}-message-${message} "disting disting"`);
      socket.write(`${encryptedMessage}\n`);
    };

    // Handle incoming data from the server
    socket.on("data", (data) => {
      const response = data.toString("utf-8").trim();

      // If the server sends the ID, extract and store it
      if (response.startsWith("id:")) {
        id = response.substring(3);
        console.log(`Your ID is ${id}`);
      } else {
        // Print decrypted server messages (if needed, implement decryption here)
        console.log(`Server says: ${response}`);
      }

      // Prompt the user for the next message
      ask();
    });
  }
);

// Handle server disconnection
socket.on("end", () => {
  console.log("Server disconnected.");
  rl.close();
  process.exit(0);
});
