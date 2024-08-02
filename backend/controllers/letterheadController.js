// backend/controllers/letterheadController.js
const Letterhead = require('../models/Letterhead');

exports.getAllLetterheads = async (req, res) => {
  try {
    const letterheads = await Letterhead.find();
    res.json(letterheads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLetterheadById = async (req, res) => {
  try {
    const letterhead = await Letterhead.findById(req.params.id);
    if (!letterhead) return res.status(404).json({ message: 'Letterhead not found' });
    res.json(letterhead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLetterhead = async (req, res) => {
  const letterhead = new Letterhead(req.body);
  try {
    const newLetterhead = await letterhead.save();
    res.status(201).json(newLetterhead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLetterhead = async (req, res) => {
  try {
    const letterhead = await Letterhead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!letterhead) return res.status(404).json({ message: 'Letterhead not found' });
    res.json(letterhead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLetterhead = async (req, res) => {
  try {
    const letterhead = await Letterhead.findByIdAndDelete(req.params.id);
    if (!letterhead) return res.status(404).json({ message: 'Letterhead not found' });
    res.json({ message: 'Letterhead deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
