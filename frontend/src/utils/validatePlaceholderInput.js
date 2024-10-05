// Function to validate input based on placeholder name
const validatePlaceholderInput = (placeholderName, value) => {
    value = value.trim(); // Remove leading and trailing spaces
  
    // Validation logic
    switch (placeholderName) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^(?!0{10})\d{10}$/.test(value);
      case 'startDate':
      case 'endDate':
         return /^\d{4}-\d{2}-\d{2}$/.test(value);
      case 'name':
        return /^[A-Za-z\s]+$/.test(value);
      case 'address':
        return /^[A-Za-z0-9\s,]+$/.test(value);
      case 'zipCode':
        return /^(?!0{5})\d{5}$/.test(value);
      case 'city':
        return /^[A-Za-z\s]+$/.test(value);
      case 'state':
        return /^[A-Za-z\s]+$/.test(value);
      case 'country':
        return /^[A-Za-z\s]+$/.test(value);
      case 'username':
        return /^[a-zA-Z0-9_]{3,20}$/.test(value);
      case 'password':
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      case 'url':
        return /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/.test(value);
      case 'creditCard':
        return /^(?!0{16})\d{16}$/.test(value);
      case 'ssn':
        return /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/.test(value);
      case 'integer':
        return /^-?(?!0)\d+$/.test(value);
      case 'float':
        return /^-?(?!0{1,})\d+\.\d+$/.test(value);
      case 'hexColor':
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
      default:
        return true; // Default to valid for unspecified placeholders
    }
  };
  