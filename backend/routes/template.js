const express = require('express');
const router = express.Router();
const { addTemplate, getTemplates } = require('../controllers/templateController');
const authenticateToken = require('../middleware/authMiddleware');

// Add a new template
router.post('/', authenticateToken, addTemplate);

// Get all templates
router.get('/', authenticateToken, getTemplates);

module.exports = router;
