const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    console.log('New client connected');

    // Handle note updates
    socket.on('update-note', (note) => {
        // Broadcast to all other clients
        socket.broadcast.emit('note-updated', note);
    });

    // Handle new notes
    socket.on('add-note', (note) => {
        // Broadcast to all other clients
        socket.broadcast.emit('note-added', note);
    });

    // Handle chat messages
    socket.on('send-chat-message', (message) => {
        // Broadcast to all clients including sender
        io.emit('new-chat-message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});