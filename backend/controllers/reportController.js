const Template = require('../models/Template');
const SavedTemplate = require('../models/SavedTemplate');
const User = require('../models/User');

// Get report data for templates
exports.getReportTemplates = async (req, res) => {
    try {
        const templates = await Template.find({});
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get report data for saved templates
exports.getReportSavedTemplates = async (req, res) => {
    try {
        const savedTemplates = await SavedTemplate.find({});
        res.json(savedTemplates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get report data for users
exports.getReportUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
