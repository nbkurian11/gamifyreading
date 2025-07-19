require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Completed Challenge Model
const completedChallengeSchema = new mongoose.Schema({
  userId: String,
  title: String,
  difficulty: String,
  description: String,
  timeFrame: String,
  bookTopic: String,
  bookSuggestion: String,
  completedDate: Date,
  xp: Number
}, { timestamps: true });

const CompletedChallenge = mongoose.model('CompletedChallenge', completedChallengeSchema);

// API Routes
// Save completed challenge
app.post('/api/completed-challenges', async (req, res) => {
  try {
    const challenge = new CompletedChallenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get completed challenges for a user
app.get('/api/completed-challenges/:userId', async (req, res) => {
  try {
    const challenges = await CompletedChallenge.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});