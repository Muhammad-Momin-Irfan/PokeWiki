const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Team = require('../models/Team');
const User = require('../models/User');

// @route   GET /api/teams
// @desc    Get all teams for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // FIX: Changed req.user.id to req.user.userId
    const teams = await Team.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/teams
// @desc    Create a new empty team
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const newTeam = new Team({
      name,
      // FIX: Changed req.user.id to req.user.userId
      user: req.user.userId, 
      members: []
    });
    
    const team = await newTeam.save();
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/teams/:id
// @desc    Delete a team
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    // Make sure user owns the team
    // FIX: Changed req.user.id to req.user.userId
    if (team.user.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await team.deleteOne();
    res.json({ msg: 'Team removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/teams/:id
// @desc    Update team members
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    // Check user ownership
    // This one was already correct in your original code!
    if (team.user.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update members
    team.members = req.body.members;
    
    await team.save();
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;