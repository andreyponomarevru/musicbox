export class ValidationError extends Error {
  origin: string;

  constructor(origin: string, message: string) {
    super(message);
    this.origin = origin;
  }
}
