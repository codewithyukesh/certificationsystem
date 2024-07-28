const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/submit', authenticateToken, userDataController.submitUserData);
router.get('/', authenticateToken, userDataController.getAllUserData);
router.get('/:id', authenticateToken, userDataController.getUserDataById);

module.exports = router;
