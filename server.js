const net = require("net");
const server = net.createServer();

const { encryptBuffer, decryptBuffer } = require('./helper');

// an array of client sockets connected
const clients = [];

// handle incoming connections
server.on("connection", (socket) => {
  
  // client id is updated every time a new connection is established
  const clientId = clients.length + 1;
  console.log(`A new connection to the server! user: ${clientId}`);
  // Broadcasting a message to everyone when someone enters the chat room
  clients.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  socket.write(`id-${clientId}`);

  // send a message to everyone connected to the server and immediately reconnect to the server again when a new connection is established to the server 
  socket.on("data", (data) => {

    console.log(data.toString("utf-8"));
    
    
    const dataString = data.toString("utf-8");

    //console.log(dataString);
    
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    
    //console.log( message,"Server Data");
  
  
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
