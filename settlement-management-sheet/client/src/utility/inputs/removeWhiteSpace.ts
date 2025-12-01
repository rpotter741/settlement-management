const removeWhitespace = (value: string): string => {
  return value.replace(/\s+/g, ' ').trim();
};

export default removeWhitespace;
