export interface SimpleValidation {
  [key: string]: any;
}

export interface NestedValidation {
  [id: string]: {
    [key: string]: string | null;
  };
}

export interface ValidationData {
  id: string;
  refId: string;
  [key: string]: any;
}

export interface ValidationState {
  [tool: string]: {
    byId: Record<string, Partial<ValidationData>>;
    allIds: string[];
  };
}

export interface SetValidationObjectPayload {
  tool: string;
  id: string;
  validationObject: Partial<ValidationData>;
}

export interface ValidateFieldPayload {
  tool: string;
  keypath: string;
  error: string | null;
  id: string;
}

export interface ValidateToolPayload {
  tool: string;
  id: string;
  fields: string[];
  refObj: any;
}

export interface ClearValidationPayload {
  tool: string;
  id: string;
}

export interface SetErrorFieldPayload {
  tool: string;
  id: string;
  keypath: string;
  value: string | null | object | any[];
}
