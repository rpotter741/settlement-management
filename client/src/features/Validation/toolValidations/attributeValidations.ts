interface Threshold {
  name: string;
  max: number;
}

interface Thresholds {
  data: Record<string, Threshold>;
  order: string[];
}

interface SettlementPointCost {
  value: number;
}

interface SettlementPointCosts {
  data: Record<string, SettlementPointCost>;
  order: string[];
}

interface AttributeValues {
  maxPerLevel?: number;
  healthPerLevel?: number;
  costPerLevel?: number;
}

type ValidationFunction<T> = (value: T) => string | null | Record<string, any>;

const attributeValidations: Record<string, ValidationFunction<any>> = {
  name: (value: string): string | null => {
    if (!value || value.trim().length < 3) {
      return 'Name must be at least 3 characters.';
    }
    return null;
  },
  description: (value: string): string | null => {
    if (!value || value.trim().length < 30) {
      return 'Description must be at least 30 characters.';
    }
    return null;
  },
  balance: (values: AttributeValues): Record<string, string | null> => {
    const errors: Record<string, string | null> = {};

    if (values.maxPerLevel === undefined) {
      errors.maxPerLevel = 'Max per level is required.';
    } else if (values.maxPerLevel <= 0) {
      errors.maxPerLevel = 'Max per level must be greater than 0.';
    } else if (values.maxPerLevel > 10) {
      errors.maxPerLevel = 'Max per level cannot be greater than 10.';
    } else {
      errors.maxPerLevel = null;
    }

    if (values.healthPerLevel === undefined) {
      errors.healthPerLevel = 'Health per level is required.';
    } else if (values.healthPerLevel < 0) {
      errors.healthPerLevel = 'Health per level cannot be negative.';
    } else {
      errors.healthPerLevel = null;
    }

    if (values.costPerLevel === undefined || values.costPerLevel <= 0) {
      errors.costPerLevel = 'Cost per level must be greater than 0.';
    } else {
      errors.costPerLevel = null;
    }

    return errors;
  },
  thresholds: (
    thresholds: Thresholds
  ): Record<string, Record<string, string | null>> => {
    return Object.entries(thresholds.data).reduce(
      (errors: any, [id, threshold]) => {
        const thresholdErrors: Record<string, string | null> = {};

        if (!threshold.name || threshold.name.trim().length < 3) {
          thresholdErrors.name =
            'Threshold name must be at least 3 characters.';
        } else {
          thresholdErrors.name = null;
        }

        if (threshold.max <= 0 || threshold.max > 100) {
          thresholdErrors.max = 'Threshold max must be between 1 and 100.';
        } else {
          thresholdErrors.max = null;
        }

        errors.data[id] = thresholdErrors;
        return errors;
      },
      {
        data: {},
        order: null,
      }
    );
  },
  settlementPointCost: (
    SPCS: SettlementPointCosts
  ): Record<string, Record<string, string | null>> => {
    return Object.entries(SPCS.data).reduce(
      (errors: any, [id, spc]) => {
        const spcErrors: Record<string, string | null> = {};

        if (spc.value <= 0) {
          spcErrors.value = 'Value must be greater than 0.';
        } else {
          spcErrors.value = null;
        }

        errors.data[id] = spcErrors;
        return errors;
      },
      {
        data: {},
        order: null,
      }
    );
  },
};

export default attributeValidations;
