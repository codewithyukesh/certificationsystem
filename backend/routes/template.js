const express = require('express');
const router = express.Router();
const { 
  addTemplate, 
  getTemplates, 
  updateTemplate, 
  deleteTemplate, 
  getTemplateById, 
  getMostUsedTemplates, 
  getUserMostUsedTemplates,
  useTemplate // Import the useTemplate function
} = require('../controllers/templateController');
const authenticateToken = require('../middleware/authMiddleware');

// Add a new template
router.post('/', authenticateToken, addTemplate);

// Get all templates
router.get('/', authenticateToken, getTemplates);

// Get most used templates globally
router.get('/most-used', authenticateToken, getMostUsedTemplates);

// Get user-specific most used templates
router.get('/user-most-used', authenticateToken, getUserMostUsedTemplates);

// Get template by ID
router.get('/:id', authenticateToken, getTemplateById);

// Update a template
router.put('/:id', authenticateToken, updateTemplate);

// Delete a template
router.delete('/:id', authenticateToken, deleteTemplate);

// Increment usage when a template is used
router.post('/:id/use', authenticateToken, useTemplate); // New endpoint for incrementing usage

module.exports = router;
