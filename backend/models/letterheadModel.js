const mongoose = require('mongoose');

const LetterheadSchema = new mongoose.Schema({
  logo: String,
  companyName: String,
  secondaryName: String,
  address: String,
  footerText1: String,
  footerText2: String,
  active: { type: Boolean, default: false } // Add active field
});

module.exports = mongoose.model('Letterhead', LetterheadSchema);
