const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http');
const {server} = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`)
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('server dah jalan ngab'));