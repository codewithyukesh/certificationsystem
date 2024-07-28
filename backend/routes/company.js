// routes/company.js
const express = require('express');
const multer = require('multer');
const Company = require('../models/Company');
const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Get company details
router.get('/', async (req, res) => {
  try {
    const company = await Company.findOne();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company details', error });
  }
});

// Update company details
router.post('/', upload.single('logo'), async (req, res) => {
  const { name, secondaryName, address } = req.body;
  const logo = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    let company = await Company.findOne();
    if (company) {
      company.name = name;
      company.secondaryName = secondaryName;
      company.address = address;
      if (logo) company.logo = logo;
    } else {
      company = new Company({ name, secondaryName, address, logo });
    }
    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error updating company details', error });
  }
});

module.exports = router;
