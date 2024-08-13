// routes/savedTemplates.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT
const SavedTemplate = require('../models/SavedTemplate');

router.post('/', authMiddleware, async (req, res) => {
  const { templateId, inputData } = req.body;

  if (!templateId || !inputData) {
    return res.status(400).json({ error: 'Template ID and input data are required' });
  }

  try {
    const savedTemplate = new SavedTemplate({
      templateId,
      userId: req.user.id, // Assuming user ID is stored in req.user by the auth middleware
      inputData,
    });

    await savedTemplate.save();
    res.status(201).json({ message: 'Template saved successfully!', savedTemplate });
  } catch (error) {
    console.error('Error saving template:', error.message);
    res.status(500).json({ error: 'An error occurred while saving the template' });
  }
});

module.exports = router;
