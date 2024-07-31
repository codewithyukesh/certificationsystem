const express = require('express');
const router = express.Router();
const { addTemplate, getTemplates, updateTemplate, deleteTemplate, getTemplateById } = require('../controllers/templateController');
const authenticateToken = require('../middleware/authMiddleware');

// Add a new template
router.post('/', authenticateToken, addTemplate);

// Get all templates
router.get('/', authenticateToken, getTemplates);

// Get template by ID
router.get('/:id', authenticateToken, getTemplateById);

// Update a template
router.put('/:id', authenticateToken, updateTemplate);

// Delete a template
router.delete('/:id', authenticateToken, deleteTemplate);

module.exports = router;
