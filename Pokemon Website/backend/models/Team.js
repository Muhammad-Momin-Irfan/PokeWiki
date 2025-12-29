const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this team to the User model
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'My Team'
  },
  members: [
    {
      id: Number, // Pokemon ID (from API)
      name: String,
      image: String,
      types: [String],
      selectedAbility: String,
      heldItem: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', TeamSchema);