const net = require("net");
const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  console.log("A new connection has been established");

  const clientId = clients.length + 1;
  // Broadcasting a message to everyone when someone enters the chat room
  clients.map((clients) => {
    clients.socket.write(`User ${clientId} joined`);
  });

  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("") + 9);
    // Broadcasting received messages to everyone
    clients.map((client) => {
      if (client.socket !== socket) {
        client.socket.write(`User ${id}: ${message}`);
      }
    });
  });

  socket.on("end", () => {
    console.log("A connection has been closed");
    clients.splice(clients.indexOf(socket), 1);
    // Broadcasting a message to everyone when someone leaves the chat room
    clients.map((client) => {
      client.socket.write(`User ${clientId} left`);
    });
  });
  // Broadcast a message to 
  clients.push({ id: clientId.toString(), socket });
});

server.listen(3000, "127.0.0.1", (err) => {
  if (err) {
    console.error("An error occurred:", err);
    return;
  }
  console.log("Chat server is listening on 127.0.0.1:3000");
});
