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

// Get all templates
const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving templates', error: error.message });
  }
};

// Update a template
const updateTemplate = async (req, res) => {
  const { templateName, content } = req.body;
  const { id } = req.params;

  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { templateName, content },
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({ message: 'Template updated successfully', template: updatedTemplate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error: error.message });
  }
};

// Delete a template
const deleteTemplate = async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete template with id: ${id}`);

  try {
    const template = await Template.findByIdAndDelete(id);
    console.log(`Template found: ${template}`);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Failed to delete template', error: error.message });
  }
};
// get template by ID
const getTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Failed to fetch template', error: error.message });
  }
};
module.exports = { addTemplate, getTemplates, updateTemplate, deleteTemplate, getTemplateById };

