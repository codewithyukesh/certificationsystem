// const UserData = require('../models/UserData');
// const Template = require('../models/Template');

// exports.getAllReports = async (req, res) => {
//   try {
//     const userData = await UserData.find().populate('templateId');
//     res.status(200).json(userData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getReportById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const userData = await UserData.findById(id).populate('templateId');
//     if (!userData) return res.status(404).json({ message: 'Report not found' });
//     res.status(200).json(userData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getReport = async (req, res) => {
    try {
      // Add logic to fetch the report data
      res.status(200).json({ message: 'Report data' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching report', error });
    }
  };
  
  module.exports = {
    getReport,
  };
  