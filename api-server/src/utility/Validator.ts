import { ValidationError } from "./ValidationError";
import { MinMax, TrackMetadata, ValidationSchema } from "../types";
import { ValidationErrorsCollection } from "./ValidationErrorsCollection";

type Schema = { [key: string]: ValidationSchema };

class Validator implements ValidationSchema {
  [key: string]: any;

  private _errors: ValidationError[];
  private schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
    this._errors = [];
  }

  get errors(): ValidationError[] {
    return this._errors;
  }

  isLength(sourceValue: string, { min, max }: MinMax): boolean {
    if (sourceValue === null) return true;
    if (Array.isArray(sourceValue)) {
      return sourceValue.every((el) => el.length >= min && el.length <= max);
    }
    if (typeof sourceValue === "string") {
      return sourceValue.length >= min && sourceValue.length <= max;
    }

    return false;
  }

  isRange(sourceValue: number, { min, max }: MinMax): boolean {
    if (sourceValue === null) sourceValue = 0;
    if (typeof sourceValue === "number") {
      return sourceValue >= min && sourceValue <= max;
    }

    return false;
  }

  includes(sourceValue: string | number, constraint: unknown[]): boolean {
    if (typeof sourceValue === "string") {
      return constraint.includes(sourceValue.toLowerCase());
    } else if (typeof sourceValue === "number") {
      return constraint.includes(sourceValue);
    }

    return false;
  }

  async validate(unvalidatedData: TrackMetadata): Promise<boolean> {
    for (const key in unvalidatedData) {
      const sourceValue = unvalidatedData[key as keyof TrackMetadata];

      for (const rule in this.schema[key]) {
        const constraints = this.schema[key][rule as keyof ValidationSchema];
        const validationResult = this[rule](sourceValue, constraints);

        if (!validationResult) {
          const text = `Rule: ${rule}. Invalid value "${sourceValue}" in "${key}" property`;
          const error = new ValidationError(unvalidatedData.filePath, text);
          this._errors.push(error);
        }
      }
    }

    if (this._errors.length > 0) {
      throw new ValidationErrorsCollection("Validation Failed: ", this._errors);
    } else return true;
  }
}

export { Validator };
