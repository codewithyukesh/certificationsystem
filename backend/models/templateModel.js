const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true }, // The template content with placeholders
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
