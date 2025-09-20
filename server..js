const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080; // Render gives PORT dynamically
const server = http.createServer();    // Create an HTTP server
const wss = new WebSocket.Server({ server });

let receiver = null;

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    console.log('New client connected');
    if (receiver && receiver.readyState === WebSocket.OPEN) {
      receiver.send(msg);
    }
  });

  ws.on('close', () => {
    if (ws === receiver) receiver = null;
  });

  ws.once('message', (msg) => {
    if (msg.toString() === 'receiver') {
      receiver = ws;
    }
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
