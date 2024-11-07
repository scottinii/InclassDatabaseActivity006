const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/artGallery', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Define the Painting schema
const paintingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    year: Number,
    description: String,
    imageUrl: String, // Add other fields if needed
});

// Create and export the Painting model
const Painting = mongoose.model('Painting', paintingSchema);
module.exports = Painting;
