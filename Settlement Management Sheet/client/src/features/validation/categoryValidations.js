const categoryValidations = {
  name: (value) => {
    if (!value || value.trim().length < 3)
      return 'Name must be at least 3 characters.';
    return null;
  },
  description: (value) => {
    if (!value || value.trim().length < 30)
      return 'Description must be at least 30 characters.';
    return null;
  },
};

export default categoryValidations;
