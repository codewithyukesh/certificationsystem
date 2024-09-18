const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT
const SavedTemplate = require('../models/SavedTemplate');

// Route for saving a template
router.post('/', authMiddleware, async (req, res) => {
  const { templateId, inputData, isIssued } = req.body;

  if (!templateId || !inputData) {
    return res.status(400).json({ error: 'Template ID and input data are required' });
  }

  try {
    const savedTemplate = new SavedTemplate({
      templateId,
      userId: req.user.id, // Assuming user ID is stored in req.user by the auth middleware
      inputData,     
      isIssued, // Set isIssued field here

    });

    await savedTemplate.save();
    res.status(201).json({ message: 'Template saved successfully!', savedTemplate });
  } catch (error) {
    console.error('Error saving template:', error.message);
    res.status(500).json({ error: 'An error occurred while saving the template' });
  }
});

// Route to get issued templates
router.get('/result', authMiddleware, async (req, res) => {
    // try {
    //     // Populate templateId and userId fields
    //     const templates = await SavedTemplate.find({ isIssued: true })
    //       .populate({
    //         path: 'templateId',
    //         select: 'title description', // Specify the fields you need
    //       })
    //       .populate({
    //         path: 'userId',
    //         select: 'name', // Specify the fields you need
    //       });
    
    //     res.json(templates);
    //   } catch (error) {
    //     console.error('Error fetching issued templates:', error);
    //     res.status(500).json({ message: 'Failed to fetch issued templates' });
    //   } 
    // });
    try {
        const templates = await SavedTemplate.find({ isIssued: true })
          .populate('templateId', 'title description') // Include title and description in the population
          .populate('userId', 'username'); // Populate userId with user name
        res.json(templates);
      } catch (error) {
        console.error('Error fetching issued templates:', error);
        res.status(500).json({ message: 'Failed to fetch issued templates' });
      } 
    });

module.exports = router;
