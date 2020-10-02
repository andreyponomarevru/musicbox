class ValidationError {
  constructor(origin, message) {
    this.origin = origin;
    this.message = message;
  }
}

module.exports = ValidationError;
