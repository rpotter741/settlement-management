const isNotEmpty = (value) => {
  if (!value || value.trim().length === 0) {
    return 'This field cannot be empty.';
  }
  return null;
};

const isUniqueName = (value, allCategories) => {
  if (
    allCategories.some(
      (category) => category.name.toLowerCase() === value.trim().toLowerCase()
    )
  ) {
    return 'A category with this name already exists.';
  }
  return null;
};

const isNotSelfDependent = (value, currentCategoryName) => {
  if (value === currentCategoryName) {
    return 'A category cannot depend on itself.';
  }
  return null;
};

/*---------------------------- ARRAYS ---------------------------- */

const categoryNameValidations = [isNotEmpty, isUniqueName];

const dependencyValidations = [isNotEmpty, isNotSelfDependent];

/*---------------------------- PIPELINE ---------------------------- */

const getValidationsForInput = (type) => {
  switch (type) {
    case 'categoryName':
      return categoryNameValidations;
    case 'dependency':
      return dependencyValidations;
    default:
      return [];
  }
};

export default getValidationsForInput;
