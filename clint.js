const net = require("net");
const readline = require("readline/promises");
const { encryptBuffer, decryptBuffer } = require("./helper");

// Set up readline interface for user input and output streams
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Clear the line before exiting
const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

// Set up write interface for user input and output streams
const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

// User's unique ID
let id;

// Create a connection to the server
const socket = net.createConnection(
  { host: "127.0.0.1", port: 3000 },
  async () => {
    console.log("Connected to the server!");

    // Function to ask for user input and send encrypted messages
    const ask = async () => {
      const message = await rl.question("Enter your message > ");

      await moveCursor(0, -1);
      await clearLine(0); // Clear the line before writing the new message

      // Encrypt the message before sending
      // const encryptedMessage = Encrypt(`${id}-message-${message} "disting disting"`);
      socket.write(`${id}-message-${message}`);
    };

    ask();

    // Handle incoming data from the server
    socket.on("data", async (data) => {

      // Move the cursor to the beginning of the line for the next message
      console.log();
      
      await moveCursor(0,-1); // Move the cursor to the beginning of the line
      await clearLine(0); // Clear the line before writing the new message

      if (data.toString("utf-8").substring(0,2) === "id") {
        id = data.toString("utf-8").substring(3);
        console.log(`Your ID is ${id}! \n`);
      }else {
        console.log(data.toString("utf-8"));
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
