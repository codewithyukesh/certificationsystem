const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true, // Ensure this matches your request body
  },
  content: {
    type: String,
    required: true, // Ensure this matches your request body
  },
  placeholders: [{ type: String }],
  createdBy: {
    type: String,
    required: true, // Ensure this is also being set in your controller
  },
});

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
