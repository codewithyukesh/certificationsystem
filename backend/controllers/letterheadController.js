const path = require('path');
const fs = require('fs');
const Letterhead = require('../models/letterheadModel');

// Get all letterheads
exports.getAllLetterheads = async (req, res) => {
  try {
    const letterheads = await Letterhead.find();
    res.json(letterheads);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get a specific letterhead by ID
exports.getLetterheadById = async (req, res) => {
  try {
    const letterhead = await Letterhead.findById(req.params.id);
    if (!letterhead) {
      return res.status(404).json({ msg: 'Letterhead not found' });
    }
    res.json(letterhead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new letterhead with file upload
exports.createLetterhead = async (req, res) => {
  try {
    const newLetterhead = new Letterhead({
      logo: req.file ? req.file.path : '', // Save file path in database
      companyName: req.body.companyName,
      secondaryName: req.body.secondaryName,
      address: req.body.address,
      footerText1: req.body.footerText1,
      footerText2: req.body.footerText2,
      active: req.body.active || false // Default to false if not provided
    });
    const savedLetterhead = await newLetterhead.save();
    res.status(201).json(savedLetterhead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a letterhead with file upload
exports.updateLetterhead = async (req, res) => {
  try {
    const updateData = {
      companyName: req.body.companyName,
      secondaryName: req.body.secondaryName,
      address: req.body.address,
      footerText1: req.body.footerText1,
      footerText2: req.body.footerText2,
      active: req.body.active // Update active status
    };

    if (req.file) {
      // Delete old file if new file is uploaded
      const existingLetterhead = await Letterhead.findById(req.params.id);
      if (existingLetterhead && existingLetterhead.logo) {
        fs.unlinkSync(existingLetterhead.logo); // Remove old file
      }
      updateData.logo = req.file.path; // Update with new file path
    }

    const updatedLetterhead = await Letterhead.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedLetterhead) {
      return res.status(404).json({ msg: 'Letterhead not found' });
    }
    res.json(updatedLetterhead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a letterhead
exports.deleteLetterhead = async (req, res) => {
  try {
    const letterhead = await Letterhead.findById(req.params.id);
    if (!letterhead) {
      return res.status(404).json({ msg: 'Letterhead not found' });
    }
    if (letterhead.logo) {
      fs.unlinkSync(letterhead.logo); // Remove file
    }
    await Letterhead.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Letterhead deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Activate a letterhead
exports.activateLetterhead = async (req, res) => {
  try {
    const letterhead = await Letterhead.findByIdAndUpdate(req.params.id, { active: true }, { new: true });
    if (!letterhead) {
      return res.status(404).json({ msg: 'Letterhead not found' });
    }
    res.json(letterhead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Deactivate a letterhead
exports.deactivateLetterhead = async (req, res) => {
  try {
    const letterhead = await Letterhead.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!letterhead) {
      return res.status(404).json({ msg: 'Letterhead not found' });
    }
    res.json(letterhead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
