const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const letterheadController = require('../controllers/letterheadController');

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Get all letterheads
router.get('/', letterheadController.getAllLetterheads);

// Get a specific letterhead by ID
router.get('/:id', letterheadController.getLetterheadById);

// Create a new letterhead with file upload
router.post('/', upload.single('logo'), letterheadController.createLetterhead);

// Update a letterhead with file upload
router.put('/:id', upload.single('logo'), letterheadController.updateLetterhead);

// Delete a letterhead
router.delete('/:id', letterheadController.deleteLetterhead);

// Activate a letterhead
router.post('/:id/activate', letterheadController.activateLetterhead);

// Deactivate a letterhead
router.post('/:id/deactivate', letterheadController.deactivateLetterhead);

module.exports = router;
