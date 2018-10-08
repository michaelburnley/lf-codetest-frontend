import express from 'express';
import http from 'http';

const app = express();

// Express app setup
const app = express();
const server = http.createServer(app);
server.listen(3000);
server.on('listening', () => {
  console.log('Server is listening on port: 3000');
});