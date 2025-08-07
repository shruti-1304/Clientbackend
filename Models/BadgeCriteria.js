const mongoose = require('mongoose');
 
const badgeCriteriaSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['contact', 'friends', 'eventAttended', 'eventOrganized', 'custom'], // adjust as needed
    required: true,
    unique: true, // One entry per category
  },
  bronze: { type: Number, default: 0 },
  silver: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  platinum: { type: Number, default: 0 },
  diamond: { type: Number, default: 0 },
}, {
  timestamps: true,
});
 
module.exports = mongoose.model('BadgeCriteria', badgeCriteriaSchema);