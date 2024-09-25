const Template = require('../models/Template');
const { extractPlaceholders } = require('../utils/templateUtils');

// Add a new template
const addTemplate = async (req, res) => {
  const { templateName, content, category } = req.body; // Accept category
  const placeholders = extractPlaceholders(content);

  try {
    const newTemplate = new Template({
      templateName,
      content,
      placeholders,
      createdBy: req.user.username,
      category, // Save the category
    });

    await newTemplate.save();
    res.status(201).json({ message: 'Template added successfully', template: newTemplate });
  } catch (error) {
    res.status(500).json({ message: 'Error adding template', error: error.message });
  }
};

// Increment template usage (global and per user)
const incrementUsage = async (templateId, userId) => {
  try {
    const template = await Template.findById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Increment global usage count
    template.usageCount += 1;

    // Increment usage count for this specific user
    const userUsageIndex = template.userUsage.findIndex(usage => usage.userId.equals(userId));
    if (userUsageIndex === -1) {
      // If user has not used this template before, add an entry
      template.userUsage.push({ userId, count: 1 });
    } else {
      // If user has used it before, increment the count
      template.userUsage[userUsageIndex].count += 1;
    }

    await template.save();
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
};

// Get all templates (with optional category filter)
const getTemplates = async (req, res) => {
  const { category } = req.query; // Optional category filter

  try {
    let query = {};
    if (category) {
      query.category = category; // Filter by category if provided
    }

    const templates = await Template.find(query);
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving templates', error: error.message });
  }
};

// Get most used templates globally (with optional category filter)
const getMostUsedTemplates = async (req, res) => {
  const { category } = req.query; // Optional category filter

  try {
    let query = { usageCount: { $gt: 0 } };
    if (category) {
      query.category = category; // Filter by category if provided
    }

    const templates = await Template.find(query)
      .sort({ usageCount: -1 })
      .limit(10);
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving most used templates', error: error.message });
  }
};

// Get most used templates for a specific user
const getUserMostUsedTemplates = async (req, res) => {
  const userId = req.user.id;

  try {
    const templates = await Template.find({ 'userUsage.userId': userId });
    
    templates.sort((a, b) => {
      const aUsage = a.userUsage.find(usage => usage.userId.equals(userId))?.count || 0;
      const bUsage = b.userUsage.find(usage => usage.userId.equals(userId))?.count || 0;
      return bUsage - aUsage;
    });

    const filteredTemplates = templates.filter(template => {
      const userUsage = template.userUsage.find(usage => usage.userId.equals(userId));
      return userUsage && userUsage.count > 0;
    });

    res.status(200).json(filteredTemplates);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user-specific most used templates', error: error.message });
  }
};

// Update a template
const updateTemplate = async (req, res) => {
  const { templateName, content, category } = req.body; // Accept category
  const { id } = req.params;

  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { templateName, content, category }, // Update category
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({ message: 'Template updated successfully', template: updatedTemplate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error: error.message });
  }
};

// Delete a template
const deleteTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    const template = await Template.findByIdAndDelete(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete template', error: error.message });
  }
};

// Get template by ID
const getTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch template', error: error.message });
  }
};

// Increment usage when a template is used
const useTemplate = async (req, res) => {
  const templateId = req.params.id;
  const userId = req.user.id;

  try {
    await incrementUsage(templateId, userId);
    res.status(200).json({ message: 'Template usage incremented successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing template usage', error: error.message });
  }
};

// Get all distinct categories
const getCategories = async (req, res) => {
  try {
    const categories = await Template.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};

module.exports = {
  addTemplate,
  getTemplates,
  getMostUsedTemplates,
  getUserMostUsedTemplates,
  incrementUsage,
  updateTemplate,
  deleteTemplate,
  getTemplateById,
  useTemplate,
  getCategories, // Export getCategories for fetching all distinct categories
};
