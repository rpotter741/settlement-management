const eventFields = {
  name: {
    name: 'name',
    label: 'Event Name',
    type: 'text',
    tooltip:
      "The name of the event. This should clearly convey the event's content and / or theme.",
    validate: (value) => {
      if (!value) return 'Event name is required';
      if (value.length < 3)
        return 'Event name must be at least 3 characters long';
      return null;
    },
    keypath: 'name',
  },
  description: {
    name: 'description',
    label: 'Description',
    type: 'text',
    tooltip: 'A description of the event and how it can shape the world.',
    multiline: true,
    minRows: 3,
    validate: (value) => {
      if (!value) return 'Description is required';
      if (value.length < 30) {
        if (30 - value.length > 1) {
          return `Description must be at least 30 characters. You have ${30 - value.length} characters remaining.`;
        } else {
          return `Description must be at least 30 characters. You have 1 character remaining.`;
        }
      }
      return null;
    },
    keypath: 'description',
  },
};

export default eventFields;
