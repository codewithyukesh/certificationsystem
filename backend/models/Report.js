const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filledContent: { type: String, required: true },
  placeholders: { type: Map, of: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
