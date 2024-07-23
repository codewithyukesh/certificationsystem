const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Get company details
router.get('/', async (req, res) => {
  try {
    const company = await Company.findOne();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update company details
router.put('/', async (req, res) => {
  try {
    const { name, address, logo, tagline } = req.body;
    const company = await Company.findOneAndUpdate(
      {},
      { name, address, logo, tagline },
      { new: true, upsert: true }
    );
    res.json(company);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
