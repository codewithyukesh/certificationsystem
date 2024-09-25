const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true, 
  },
  content: {
    type: String,
    required: true, 
  },
  placeholders: [{ type: String }],
  createdBy: {
    type: String,
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0, // Global usage count
  },
  userUsage: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      count: { type: Number, default: 0 }, // Usage count per user
    },
  ],
  category: {
    type: String, // Single category, or use [String] for multiple categories
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set current date as default
  },
});

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
