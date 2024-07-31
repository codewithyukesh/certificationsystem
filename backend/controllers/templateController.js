const Template = require('../models/Template');

// Add a new template
const addTemplate = async (req, res) => {
  const { templateName, content } = req.body;

  try {
    const newTemplate = new Template({
      templateName,
      content,
      createdBy: req.user.username  // Ensure this field exists in your schema
    });

    await newTemplate.save();
    res.status(201).json({ message: 'Template added successfully', template: newTemplate });
  } catch (error) {
    res.status(500).json({ message: 'Error adding template', error: error.message });
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving templates', error: error.message });
  }
};

module.exports = { addTemplate, getTemplates };
