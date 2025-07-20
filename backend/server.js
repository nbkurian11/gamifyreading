require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const jwt = require('jsonwebtoken'); // No longer needed directly here, moved to userRoutes
// const bcrypt = require('bcryptjs'); // No longer needed directly here, moved to User model

const challengeRoutes = require('./routes/challengeRoutes.js');
const userRoutes = require('./routes/userRoutes'); // Import your user routes

const app = express();
const port = process.env.PORT || 5000;

// Global variable to store total XP
// NOTE: For a multi-user system, XP should ideally be stored per user in the User model
// This globalTotalXP will now represent a system-wide total or a logged-in user's total.
// For true user-specific XP, you'd add an 'xp' field to your User model.
let globalTotalXP = 0; // Consider refactoring this to be user-specific

app.use(cors());
app.use(express.json()); // Body parser middleware for JSON

mongoose.connect(process.env.MONGO_URI) // useNewUrlParser and useUnifiedTopology are deprecated and no longer needed
.then(async () => {
    console.log('✅ MongoDB connected successfully');
    // Calculate total XP on server startup (still calculates global XP)
    await calculateTotalXP();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Function to calculate and update global XP
// This function still calculates total XP from all completed challenges.
// If you want user-specific XP, this logic will need to change to group by userId.
async function calculateTotalXP() {
    try {
        // Dynamic model definition is generally not recommended for repeated use.
        // It's better to define your models once at application start.
        // Assuming 'completedchallenges' is used elsewhere and defined as a proper model.
        // If not, define it consistently in a 'models' directory.
        let CompletedChallenge;
        try {
            CompletedChallenge = mongoose.model('completedchallenges');
        } catch (error) {
            // Model not yet defined, define it
            const completedChallengeSchema = new mongoose.Schema({
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
                title: String,
                difficulty: String,
                description: String,
                timeFrame: String,
                bookTopic: String,
                bookSuggestion: String,
                completedDate: Date,
                xp: Number,
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now }
            });
            CompletedChallenge = mongoose.model('completedchallenges', completedChallengeSchema);
        }


        const result = await CompletedChallenge.aggregate([
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

// Function to add XP and update global total
function addXP(xpAmount) {
    globalTotalXP += xpAmount;
    console.log(`🎯 Added ${xpAmount} XP. New total: ${globalTotalXP}`);
}

// API endpoint to get total XP
app.get('/api/total-xp', (req, res) => {
    res.json({ totalXP: globalTotalXP });
});

// API endpoint to add XP and update global total
// NOTE: For a multi-user system, this should likely be updated to add XP to a specific user.
app.post('/api/add-xp', (req, res) => {
    const { xp } = req.body;
    if (typeof xp !== 'number') {
        return res.status(400).json({ error: 'Invalid XP amount provided' });
    }
    addXP(xp);
    res.json({
        message: 'XP added successfully',
        totalXP: globalTotalXP
    });
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

// Route for user authentication (register and login)
app.use('/api/users', userRoutes); // User authentication routes

// Other routes
app.use('/api/completed-challenges', challengeRoutes); // Ensure this route handler is correctly defined in challengeRoutes.js


app.get('/', (req, res) => {
    res.send(`API is running... Total XP: ${globalTotalXP}`);
});

// Error handling middleware
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