const mongoose = require('mongoose');

const fiscalYearSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: false }
});

const FiscalYear = mongoose.model('FiscalYear', fiscalYearSchema);

module.exports = FiscalYear;
