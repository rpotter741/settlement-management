const keyFields = {
  name: {
    name: 'name',
    label: 'Key Name',
    type: 'text',
    tooltip:
      "The unique name of the key. This should clearly convey the key's theme or topic.",
    validate: (value) => {
      if (!value) return 'Key name is required';
      if (value.length < 3)
        return 'Key name must be at least 3 characters long';
      return null;
    },
    keypath: 'name',
  },
  description: {
    name: 'description',
    label: 'Description',
    type: 'text',
    tooltip: 'A brief description of the key and its intended use.',
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

export default keyFields;
