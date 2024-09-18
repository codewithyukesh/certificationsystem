const express = require('express');
const router = express.Router();
const { getReportTemplates, getReportSavedTemplates, getReportUsers } = require('../controllers/reportController');

// Define routes to get report data
router.get('/report-templates', getReportTemplates);
router.get('/report-saved-templates', getReportSavedTemplates);
router.get('/report-users', getReportUsers);

module.exports = router;
