const FiscalYear = require('../models/fiscalYear');

const getFiscalYears = async (req, res) => {
  try {
    const fiscalYears = await FiscalYear.find();
    res.status(200).json(fiscalYears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFiscalYear = async (req, res) => {
  const { name } = req.body;
  try {
    const newFiscalYear = new FiscalYear({ name });
    await newFiscalYear.save();
    res.status(201).json(newFiscalYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const activateFiscalYear = async (req, res) => {
  try {
    await FiscalYear.updateMany({}, { $set: { active: false } });
    const fiscalYear = await FiscalYear.findByIdAndUpdate(req.params.id, { active: true }, { new: true });
    res.status(200).json(fiscalYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deactivateFiscalYear = async (req, res) => {
  try {
    const fiscalYear = await FiscalYear.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    res.status(200).json(fiscalYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFiscalYear = async (req, res) => {
  try {
    await FiscalYear.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Fiscal year deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFiscalYears,
  addFiscalYear,
  activateFiscalYear,
  deactivateFiscalYear,
  deleteFiscalYear
};
