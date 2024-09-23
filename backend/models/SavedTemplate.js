const mongoose = require('mongoose');

const savedTemplateSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  },
  templateTitle: {
    type: String,
    required: true,
  },
  templateDescription: {
    type: String,
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
  isIssued: {
    type: Boolean,
    default: false, // Ensure this field is default to false
  },
  // savedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model

});

const SavedTemplate = mongoose.model('SavedTemplate', savedTemplateSchema);

module.exports = SavedTemplate;
