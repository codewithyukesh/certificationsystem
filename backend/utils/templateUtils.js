// utils/templateUtils.js

// Utility function to extract placeholders from template content
const extractPlaceholders = (content) => {
    const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    let match;
    const placeholders = [];
    while ((match = regex.exec(content)) !== null) {
      placeholders.push(match[1]);
    }
    return placeholders;
  };
  
  module.exports = { extractPlaceholders };
  