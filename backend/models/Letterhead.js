// backend/models/Letterhead.js
const mongoose = require('mongoose');

const letterheadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // URL or path to the logo image
  companyName: { type: String, required: true },
  secondaryName: { type: String },
  address: { type: String },
  refNo: { type: String },
  dispatchNo: { type: String },
  footer: {
    contactDetails: {
      phone: { type: String },
      email: { type: String },
      website: { type: String }
    },
    tagline: { type: String }
  },
  isActive: { type: Boolean, default: false } // To set the active letterhead
});

module.exports = mongoose.model('Letterhead', letterheadSchema);
