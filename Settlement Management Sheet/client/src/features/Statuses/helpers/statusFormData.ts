const statusFields = {
  name: {
    name: 'name',
    label: 'Status Name',
    type: 'text',
    tooltip:
      "The unique name of the status. This should clearly convey the status's shape or meaning within the system mechanics",
    validate: (value) => {
      if (!value) return 'Status name is required';
      if (value.length < 3)
        return 'Status name must be at least 3 characters long';
      return null;
    },
    keypath: 'name',
  },
  description: {
    name: 'description',
    label: 'Description',
    type: 'text',
    tooltip:
      'A brief description of the status and its impact on system mechanics.',
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

export default statusFields;
