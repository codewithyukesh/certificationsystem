// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    savedTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavedTemplate' },
    issuedOn: { type: Date, default: Date.now },
    // Add other fields as needed
});

module.exports = mongoose.model('Report', reportSchema);
