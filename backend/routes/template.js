const express = require('express');
const router = express.Router();
const Template = require('../models/Template'); // Make sure to import the Template model
const {
  addTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
  getTemplateById,
  getMostUsedTemplates,
  getUserMostUsedTemplates,
  useTemplate,
  getCategories,
} = require('../controllers/templateController');
const authenticateToken = require('../middleware/authMiddleware');

// Helper functions for case-insensitive search
function toLowerCase(str) {
  let lowerStr = '';
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      lowerStr += String.fromCharCode(charCode + 32); // Convert uppercase to lowercase
    } else {
      lowerStr += str[i]; // Keep other characters the same
    }
  }
  return lowerStr;
}

function areStringsEqual(str1, str2) {
  if (str1.length !== str2.length) return false;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) return false;
  }
  return true;
}

// Add a new template
router.post('/', authenticateToken, addTemplate);

// Get all templates (with optional category filter)
router.get('/', authenticateToken, getTemplates);
// search 
router.get('/search', authenticateToken, async (req, res) => {
  const searchTemplateName = req.query.templateName; // Get the search term from the query parameter
  console.log('Search Term:', searchTemplateName); // Log the search term

  if (!searchTemplateName) {
    return res.status(400).json({ success: false, message: 'Search term is required.' });
  }

  try {
    const templates = await Template.find({}); // Fetch all templates from the database
    console.log('Templates Found:', templates); // Log the fetched templates

    // Convert search term to lowercase manually
    const searchTemplateNameLower = toLowerCase(searchTemplateName);
    console.log('Lowercase Search Term:', searchTemplateNameLower); // Log the lowercase search term

    // Perform linear search for partial matches
    const results = [];
    for (let i = 0; i < templates.length; i++) {
      const templateNameLower = toLowerCase(templates[i].templateName); // Ensure you're accessing the correct field name
      if (templateNameLower.includes(searchTemplateNameLower)) { // Check for partial match
        results.push(templates[i]);
      }
    }

    if (results.length > 0) {
      res.status(200).json({ success: true, data: results });
    } else {
      res.status(404).json({ success: false, message: 'No templates found.' });
    }
  } catch (error) {
    console.error('Search Error:', error); // Log the actual error
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});


// Get most used templates globally (with optional category filter)
router.get('/most-used', authenticateToken, getMostUsedTemplates);

// Get user-specific most used templates
router.get('/user-most-used', authenticateToken, getUserMostUsedTemplates);

// Get distinct categories
router.get('/categories', authenticateToken, getCategories); // New route for fetching all distinct categories

// Get template by ID
router.get('/:id', authenticateToken, getTemplateById);

// Update a template
router.put('/:id', authenticateToken, updateTemplate);

// Delete a template
router.delete('/:id', authenticateToken, deleteTemplate);

// Increment usage when a template is used
router.post('/:id/use', authenticateToken, useTemplate); // New endpoint for incrementing usage

module.exports = router;
