import attributeValidations from './toolValidations/attributeValidations.js';
import categoryValidations from './toolValidations/categoryValidations.js';

export interface ValidationMap {
  [key: string]: {
    [key: string]: (value: any) => string | null;
  };
}

const validationsMap = {
  attribute: attributeValidations,
  category: categoryValidations,
};

export default validationsMap;
