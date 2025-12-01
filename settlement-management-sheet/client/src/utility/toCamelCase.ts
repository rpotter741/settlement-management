const toCamelCase = (str) => {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) // Uppercase after spaces
    .replace(/\s/g, '') // Remove spaces
    .replace(/^(.)/, (_, char) => char.toLowerCase()); // Lowercase first letter
};

export default toCamelCase;
