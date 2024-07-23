const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  logo: {
    type: String, // Assuming the logo is stored as a URL
    required: false
  },
  tagline: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Company', companySchema);
