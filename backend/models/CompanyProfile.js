const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  logoPath: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);
