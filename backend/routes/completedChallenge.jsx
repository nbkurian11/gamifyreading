const express = require('express');
const router = express.Router();
const CompletedChallenge = require('../models/CompletedChallenge');

// Save completed challenge
router.post('/', async (req, res) => {
  try {
    const challenge = new CompletedChallenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get completed challenges for a user
router.get('/:userId', async (req, res) => {
  try {
    const challenges = await CompletedChallenge.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;