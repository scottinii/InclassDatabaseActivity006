const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const Painting = require('./painting'); // Import the Painting model

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Set up Socket.IO

// Middleware to parse JSON requests
app.use(express.json());  // Add this line to handle JSON body parsing
app.use(express.static('public')); // Serve static files from the public directory

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

// Add this route to handle the PUT request
app.put('/api/paintings/update', async (req, res) => {
    const { PaintingID, Title, FirstName, LastName, Description } = req.body;

    try {
        // Update painting in the database
        const updatedPainting = await Painting.findOneAndUpdate(
            { PaintingID: PaintingID },
            { Title, FirstName, LastName, Description },
            { new: true } // Returns the updated painting
        );

        if (!updatedPainting) {
            return res.status(404).send('Painting not found');
        }

        res.status(200).json(updatedPainting); // Send the updated painting as the response
    } catch (err) {
        console.error('Error updating painting:', err);
        res.status(500).send('Error updating painting');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
