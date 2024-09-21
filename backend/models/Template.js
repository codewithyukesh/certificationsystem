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
});

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
