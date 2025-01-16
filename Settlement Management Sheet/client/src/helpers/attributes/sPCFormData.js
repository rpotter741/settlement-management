const sPCFormData = {
  name: '',
  tooltip: '',
  type: 'number',
  validate: (value) => {
    if (value <= 0) return 'Value must be greater than 0';
    return null;
  },
  keypath: '',
};

export default sPCFormData;
