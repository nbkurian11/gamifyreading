const mongoose = require('mongoose');

const completedChallengeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  description: String,
  timeFrame: String,
  bookTopic: String,
  bookSuggestion: String,
  completedDate: {
    type: Date,
    default: Date.now
  },
  xp: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CompletedChallenge', completedChallengeSchema);