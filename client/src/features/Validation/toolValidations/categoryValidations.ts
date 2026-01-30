interface Threshold {
  name: string;
  max: number;
}

interface Thresholds {
  data: Record<string, Threshold>;
  order: string[];
}

interface DepThreshold {
  name: string;
  modifier: number;
}

interface Dependency {
  name: string;
  thresholds: DepThreshold[];
}

interface Dependencies {
  data: Record<string, Dependency>;
  order: string[];
}

type ValidationFunction<T> = (value: T) => string | null | Record<string, any>;

const categoryValidations: Record<string, ValidationFunction<any>> = {
  name: (value: string): string | null =>
    value.trim().length >= 3 ? null : 'Name must be at least 3 characters.',

  description: (value: string): string | null =>
    value.trim().length >= 30
      ? null
      : 'Description must be at least 30 characters.',

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
        order: thresholds.order,
      }
    );
  },

  dependencies: (deps: Dependencies): any =>
    Object.entries(deps.data).reduce(
      (
        errors: {
          data: Record<string, Record<string, string | null>>;
          order: string[];
        },
        [id, dep]
      ) => {
        const thresholdErrors: Record<string, string | null> = {};

        dep.thresholds.forEach((thresh, index) => {
          if (thresh.modifier <= 0) {
            thresholdErrors[`modifier_${index}`] =
              'Modifier must be greater than 0.';
          }
        });

        errors.data[id] = { ...thresholdErrors, name: null }; // Explicitly set `name` to `null` since it's always valid
        return errors;
      },
      {
        data: {},
        order: deps.order,
      }
    ),
};

export default categoryValidations;
