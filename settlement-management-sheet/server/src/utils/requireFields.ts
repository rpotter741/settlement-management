const requireFields = (fields, obj, res) => {
  for (const key of fields) {
    if (!(key in obj)) {
      console.log(`Missing field: ${key}`);
      res.status(400).json({ message: `${key} is required.` });
      return false;
    }
  }
  return true;
};

export default requireFields;
