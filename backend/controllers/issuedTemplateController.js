const SavedTemplate = require('../models/SavedTemplate');

exports.getIssuedTemplates = async (req, res) => {
  try {
    // Fetch issued templates with `isIssued` set to true
    const issuedTemplates = await SavedTemplate.find({ isIssued: true })
      .populate('templateId', 'templateName') // Optionally populate template details
      .populate('userId', 'username'); // Optionally populate user details
    
    res.json(issuedTemplates);
  } catch (error) {
    console.error('Error fetching issued templates:', error);
    res.status(500).json({ message: 'Failed to fetch issued templates' });
  }
};
