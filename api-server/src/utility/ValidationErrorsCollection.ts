import { ValidationError } from "./ValidationError";

export class ValidationErrorsCollection extends Error {
  errors: ValidationError[];

  constructor(message: string, errors: ValidationError[]) {
    super(message);
    this.errors = errors;
  }
}
