const setKeypathValue = (obj, keypath, value) => {
  const keys = keypath.split('.');
  keys.reduce((acc, key, index) => {
    if (index === keys.length - 1) {
      acc[key] = value;
    } else {
      if (!acc[key]) acc[key] = {};
    }
    return acc[key];
  }, obj);
};

export { setKeypathValue };
