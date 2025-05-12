const handleSnakeCaseName = (name) => {
  let value = name;

  value = value.replace(/\s+/g, '_');
  value = value.replace(/[^a-zA-Z0-9_]/g, '');
  value = value.toLowerCase();
  return value;
};

export default handleSnakeCaseName;
