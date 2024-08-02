// backend/routes/letterheadRoutes.js
const express = require('express');
const router = express.Router();
const { getAllLetterheads, getLetterheadById, createLetterhead, updateLetterhead, deleteLetterhead } = require('../controllers/letterheadController');

// Get all letterheads
router.get('/', getAllLetterheads);

// Get a specific letterhead by ID
router.get('/:id', getLetterheadById);

// Create a new letterhead
router.post('/', createLetterhead);

// Update an existing letterhead
router.put('/:id', updateLetterhead);

// Delete a letterhead
router.delete('/:id', deleteLetterhead);

module.exports = router;
