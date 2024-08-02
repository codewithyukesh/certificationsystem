function extractPlaceholders(templateContent) {
    const placeholderRegex = /{{(.*?)}}/g;
    const placeholders = [];
    let match;
  
    while ((match = placeholderRegex.exec(templateContent)) !== null) {
      placeholders.push(match[1]);
    }
  
    return placeholders;
  }
  
  module.exports = { extractPlaceholders };
  