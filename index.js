// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Painting = require('./models/painting'); // Import the Painting model

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json()); // For parsing JSON data in requests
app.use(cors()); // For allowing cross-origin requests
app.use(express.static('public')); // Serve static files from the public directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/artGallery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// API to get all paintings
app.get('/api/paintings', async (req, res) => {
    try {
        const paintings = await Painting.find(); // Fetch all paintings
        res.json(paintings); // Send them as JSON response
    } catch (err) {
        res.status(500).send('Error retrieving paintings');
    }
});

// API to update a painting by ID
app.put('/api/paintings/:id', async (req, res) => {
    try {
        const painting = await Painting.findByIdAndUpdate(req.params.id, req.body, {
            new: true // Return the updated painting
        });
        if (!painting) return res.status(404).send('Painting not found');
        res.json(painting); // Send the updated painting
    } catch (err) {
        res.status(500).send('Error updating painting');
    }
});

// Define a port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
