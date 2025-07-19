require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const challengeRoutes = require('./routes/challengeRoutes.js');
// Corrected line: Removed the extra 'require('./'
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Global variable to store total XP (will be synced with DB)
let globalTotalXP = 0;

app.use(cors());
app.use(express.json());

// Define a Mongoose Schema and Model for Global XP
// This will store a single document with the cumulative total XP
const GlobalXPSchema = new mongoose.Schema({
    total: { type: Number, default: 0 }
});
const GlobalXP = mongoose.models.GlobalXP || mongoose.model('GlobalXP', GlobalXPSchema);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ MongoDB connected successfully');

    // Ensure the GlobalXP document exists and initialize it if not
    // This creates the document with total: 0 if it's the first time
    await GlobalXP.findOneAndUpdate({}, { $setOnInsert: { total: 0 } }, { upsert: true, new: true });

    // Calculate total XP from the dedicated GlobalXP document on server startup
    await calculateTotalXP();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Function to calculate and update global XP from the GlobalXP document
async function calculateTotalXP() {
    try {
        const globalXPDoc = await GlobalXP.findOne({});
        globalTotalXP = globalXPDoc ? globalXPDoc.total : 0;
        console.log(`📊 Total XP loaded from DB: ${globalTotalXP}`);
    } catch (error) {
        console.error('❌ Error calculating total XP from DB:', error);
        globalTotalXP = 0; // Reset on error to prevent undefined state
    }
}

// Function to add XP and update global total, persisting to DB
async function addXP(xpAmount) {
    try {
        // Find and update the single GlobalXP document
        // $inc increments the 'total' field by xpAmount
        // upsert: true creates the document if it doesn't exist
        // new: true returns the updated document
        const updatedDoc = await GlobalXP.findOneAndUpdate(
            {},
            { $inc: { total: xpAmount } },
            { upsert: true, new: true }
        );
        globalTotalXP = updatedDoc.total; // Update in-memory variable with the persisted value
        console.log(`🎯 Added ${xpAmount} XP. New persisted total: ${globalTotalXP}`);
    } catch (error) {
        console.error('❌ Error persisting XP to DB:', error);
    }
}

// API endpoint to get total XP
app.get('/api/total-xp', (req, res) => {
    res.json({ totalXP: globalTotalXP });
});

// API endpoint to add XP and update global total (now persists to DB)
app.post('/api/add-xp', async (req, res) => { // Make this route async
    const { xp } = req.body;
    if (typeof xp !== 'number' || xp < 0) {
        return res.status(400).json({ error: 'Invalid XP amount provided.' });
    }
    await addXP(xp); // Await the persistence operation
    res.json({ message: `XP added successfully`, totalXP: globalTotalXP });
});


// API endpoint to recalculate total XP (this will now just reload from the GlobalXP document)
app.post('/api/recalculate-xp', async (req, res) => {
    try {
        await calculateTotalXP(); // Reloads from the GlobalXP document
        res.json({
            message: 'XP recalculated successfully',
            totalXP: globalTotalXP
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to recalculate XP' });
    }
});

app.use('/api/completed-challenges', challengeRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send(`API is running... Total XP: ${globalTotalXP}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Export functions for use in other files (though mostly used internally now)
module.exports = {
    getTotalXP,
    addXP,
    calculateTotalXP
};
