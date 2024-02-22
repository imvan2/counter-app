const http = require("http");
const { WebSocketServer } = require("ws");

// Comes from node, no need to npm
const url = require("url");

// Substantation the http and web server
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
let number = 0;

const broadcastNumber = () => {
  const message = JSON.stringify({ number });
  wsServer.clients.forEach((client) => {
    client.send(message);
  });
};

wsServer.on("connection", (connection) => {
  console.log("Client connected");
  // ws://localhost:8000

  connection.on("message", (message) => {
    console.log("Message received:", message);

    // Parse the message as JSON
    const data = JSON.parse(message);
    console.log("data:", data);

    // Store the number sent by the client
    number = data.number;
    console.log("Updated number:", number);

    // Relay the number back to the client
    broadcastNumber();
  });

  //   connection.on("close", () => handleClose());
});

// Listening to connections
server.listen(port, () => {
  console.log(`Websocket server is running on port ${port}`);
});

// Accept incoming messages
