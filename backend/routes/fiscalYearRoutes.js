const express = require('express');
const { getFiscalYears, addFiscalYear, activateFiscalYear, deactivateFiscalYear, deleteFiscalYear } = require('../controllers/fiscalYearController');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');


router.get('/', authenticateToken, getFiscalYears);
router.post('/', authenticateToken, addFiscalYear);
router.patch('/:id/activate', authenticateToken, activateFiscalYear);
router.patch('/:id/deactivate', authenticateToken, deactivateFiscalYear);
router.delete('/:id', authenticateToken, deleteFiscalYear);

module.exports = router;
