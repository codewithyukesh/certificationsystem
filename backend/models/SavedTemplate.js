// models/SavedTemplate.js
const mongoose = require('mongoose');

const savedTemplateSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  inputData: {
    type: Map,
    of: String,
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

const SavedTemplate = mongoose.model('SavedTemplate', savedTemplateSchema);

module.exports = SavedTemplate;
