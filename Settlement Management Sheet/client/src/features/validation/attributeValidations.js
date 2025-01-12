export const validateMPL = (value) => {
  if (value <= 0) return 'Max Per Level must be greater than 0';
  return null;
};

export const validateHPL = (value) => {
  if (value < 0) return 'Health Per Level must be greater than or equal to 0';
  return null;
};

export const validateCPL = (value) => {
  if (value < 0) return 'Currency Per Level must be greater than or equal to 0';
  return null;
};

export const validateSPC = (value) => {
  if (value <= 0) return 'Value must be greater than 0';
  return null;
};

export const validateSettlementPointCosts = (settlementPointCosts) => {
  if (!settlementPointCosts) return 'Settlement Point Costs are required';
  return Object.keys(settlementPointCosts).map((key) => {
    return {
      [key]: validateSPC(settlementPointCosts[key]),
    };
  });
};

const attributeValidations = {
  validateMPL,
  validateHPL,
  validateCPL,
  validateSPC,
  validateSettlementPointCosts,
};

export default attributeValidations;
