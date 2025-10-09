const categoryFields = {
  name: {
    name: 'name',
    label: 'Category Name',
    type: 'text',
    tooltip:
      "The unique name of the category. This should clearly convey the category's purpose and role within the settlement mechanics.",
    validate: (value) => {
      if (!value) return 'Category name is required';
      if (value.length < 3)
        return 'Category name must be at least 3 characters long';
      return null;
    },
    keypath: 'name',
  },
  description: {
    name: 'description',
    label: 'Description',
    type: 'text',
    tooltip:
      'A brief description of the category and its role within the settlement mechanics.',
    multiline: true,
    minRows: 3,
    validate: (value) => {
      if (!value) return 'Description is required';
      if (value.length < 30)
        return `Description must be at least 30 characters. You have ${30 - value.length} characters remaining.`;
      return null;
    },
    keypath: 'description',
  },
};

export default categoryFields;
