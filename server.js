const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const Painting = require('./painting'); // Import the Painting model

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Set up Socket.IO

// Serve static files from the public directory
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/artGallery', { useNewUrlParser: true, useUnifiedTopology: true });

// API endpoint to get all paintings
app.get('/api/paintings', async (req, res) => {
    try {
        const paintings = await Painting.find({});
        res.json(paintings);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Handle painting update request from the client
    socket.on('update painting', async (updatedPainting) => {
        try {
            // Logic to update the painting in the database
            const { paintingID, ...updateData } = updatedPainting; // Assuming updatedPainting contains a PaintingID field
            await Painting.findOneAndUpdate({ PaintingID: paintingID }, updateData);
            
            // Optionally, you can emit an event back to the client confirming the update
            socket.emit('painting updated', { message: 'Painting updated successfully' });
            
            // Emit the updated list of paintings to all clients
            const paintings = await Painting.find({});
            io.emit('update paintings list', paintings); // Notify all clients of the updated paintings
        } catch (err) {
            console.error('Error updating painting:', err);
            socket.emit('error', { message: 'Error updating painting' });
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});