const Template = require('../models/Template');

const addTemplate = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newTemplate = new Template({ title, content });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add template', error });
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch templates', error });
  }
};

module.exports = {
  addTemplate,
  getTemplates,
};
