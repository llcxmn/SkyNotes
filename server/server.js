// Load environment variables from .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

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

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.post('/api/save-log', (req, res) => {
    const logs = req.body.logs;
    if (!logs) return res.status(400).json({ error: 'No logs provided' });
    const logPath = path.join(__dirname, '../client/src/log/notes_log.json');
    fs.writeFile(logPath, JSON.stringify(logs, null, 2), err => {
        if (err) {
            console.error('Failed to write log:', err);
            return res.status(500).json({ error: 'Failed to write log' });
        }
        res.json({ success: true });
    });
});


// Run resetAllUsedThisDay every 24 hours (midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const { resetAllUsedThisDay } = require('./dynamoDB');
    const count = await resetAllUsedThisDay();
    console.log(`[CRON] Reset used_this_day for ${count} users at ${new Date().toISOString()}`);
  } catch (err) {
    console.error('[CRON] Error during used_this_day reset:', err);
  }
});

// Run deleteOldTrashedNotes every 7 days (Sunday at midnight)
cron.schedule('0 0 * * 0', async () => {
  try {
    const { deleteOldTrashedNotes } = require('./dynamoDB');
    const deleted = await deleteOldTrashedNotes();
    console.log(`[CRON] Deleted ${deleted} trashed notes at ${new Date().toISOString()}`);
  } catch (err) {
    console.error('[CRON] Error during trash cleanup:', err);
  }
});

app.listen(3002, () => {
    console.log('Express server running on http://localhost:3002');
});