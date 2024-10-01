const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/local', { // Change to your database name
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the Item schema
const ItemSchema = new mongoose.Schema({
    name: String,
    quantity: { type: Number, default: 1 }, // Set default quantity to 1
});

const Item = mongoose.model('Item', ItemSchema, 'names');

// Get all items or filter by name
app.get('/items', async (req, res) => {
    try {
        const name = req.query.name; // Get name from query parameters
        const items = name ? await Item.find({ name }) : await Item.find(); // Filter if name provided
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving items' });
    }
});

// Create a new item
app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item' });
    }
});

// Other CRUD operations...

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Database service running on port ${PORT}`);
});
