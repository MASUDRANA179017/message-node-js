const { log } = require("console");
const net = require("net");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let id;
const socket = net.createConnection(
  { host: "127.0.0.1", port: 3000 },
  async () => {
    console.log("Connect to server...");
    let ask = async () => {
      const message = await rl.question("Enter your message:");
      socket.write(`${id}-message-${message}\n`);
    };

    socket.on("data", (data) => {
      //   console.log(data);

      if (data.toString("utf-8").substring(0, 2) === "id") {
        console.log();
        id = data.toString("utf-8").substring(3);

        console.log(`Your id is ${id} \n`);
      } else {
        console.log(data.toString("utf-8"));
      }
      ask();
    });
  }
);

socket.on("end", () => {
  console.log("Server disconnected.");
  process.exit(0);
});
