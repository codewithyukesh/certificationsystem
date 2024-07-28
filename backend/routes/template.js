const express = require('express');
const router = express.Router();
const { addTemplate, getTemplates } = require('../controllers/templateController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, addTemplate);
router.get('/', authenticateToken, getTemplates);

module.exports = router;
