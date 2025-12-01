const sPCFormData = {
  name: '',
  tooltip: '',
  type: 'number',
  validate: (value) => {
    if (value <= -1) return 'Value must be 0 or greater';
    return null;
  },
  keypath: '',
};

export default sPCFormData;
