require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const challengeRoutes = require('./routes/challengeRoutes.js');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Global variable to store total XP
let globalTotalXP = 0;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ MongoDB connected successfully');
    // Calculate total XP on server startup
    await calculateTotalXP();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Function to calculate and update global XP
async function calculateTotalXP() {
    try {
        // Assuming your collection name is "challenges" or similar
        // Replace "Challenge" with your actual model name
        const completedchallenges = mongoose.model('completedchallenges', new mongoose.Schema({
            userId: String,
            title: String,
            difficulty: String,
            description: String,
            timeFrame: String,
            bookTopic: String,
            bookSuggestion: String,
            completedDate: Date,
            xp: Number,
            createdAt: Date,
            updatedAt: Date
        }));

        const result = await completedchallenges.aggregate([
            {
                $group: {
                    _id: null,
                    totalXP: { $sum: "$xp" }
                }
            }
        ]);

        globalTotalXP = result.length > 0 ? result[0].totalXP : 0;
        console.log(`📊 Total XP calculated: ${globalTotalXP}`);
    } catch (error) {
        console.error('❌ Error calculating total XP:', error);
    }
}

// Function to get current total XP
function getTotalXP() {
    return globalTotalXP;
}

// Function to add XP and update global total
function addXP(xpAmount) {
    // Typecast the xpAmount to an integer and check if it's a valid number
    const xpToAdd = parseInt(xpAmount, 10);
    
    if (!isNaN(xpToAdd)) {
        globalTotalXP += xpToAdd;
        console.log(`🎯 Added ${xpToAdd} XP. New total: ${globalTotalXP}`);
    } else {
        console.error(`❌ Invalid XP amount received: ${xpAmount}`);
    }
}

// API endpoint to get total XP
app.get('/api/total-xp', (req, res) => {
    res.json({ totalXP: globalTotalXP });
});

// API endpoint to recalculate total XP
app.post('/api/recalculate-xp', async (req, res) => {
    try {
        await calculateTotalXP();
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

// Export functions for use in other files
module.exports = {
    getTotalXP,
    addXP,
    calculateTotalXP
};