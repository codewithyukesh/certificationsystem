const express = require('express');
const router = express.Router();
const { getReport } = require('../controllers/reportController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getReport);

module.exports = router;
