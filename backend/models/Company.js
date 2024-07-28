// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  secondaryName: { type: String },
  address: { type: String, required: true },
  logo: { type: String } // URL to the logo image
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
