const ValidationError = require("./ValidationError.js");

class Validator {
  constructor(schema) {
    this._schema = schema;
    this._errors = [];
  }

  get errors() {
    return this._errors;
  }

  _isType(sourceValue, targetTypes = []) {
    return targetTypes.some((targetType) => {
      if (targetType === "string") return this._isString(sourceValue);
      if (targetType === "number") return this._isNum(sourceValue);
      if (targetType === "integer") return this._isInt(sourceValue);
      if (targetType === null) return this._isNull(sourceValue);
      if (targetType === "array") return Array.isArray(sourceValue);
    });
  }

  _isString(value) {
    if (typeof value !== "string") return false;
    else return true;
  }

  _isNull(value) {
    if (value !== null) return false;
    else return true;
  }

  _isNum(value) {
    if (typeof value !== "number") return false;
    if (value !== Number(value)) return false;
    if (Number.isFinite(value) === false) return false;
    return true;
  }

  _isInt(value) {
    if (!this._isNum(value) || !Number.isInteger(value)) return false;
    else return true;
  }

  _isRequired(sourceValue, targetValue) {
    return !!sourceValue === targetValue;
  }

  _isLength(sourceValue, { min, max }) {
    if (sourceValue === null) sourceValue = "";
    return sourceValue.length >= min && sourceValue.length <= max;
  }

  _isRange(sourceValue, { min, max }) {
    if (sourceValue === null) sourceValue = 0;
    return sourceValue >= min && sourceValue <= max;
  }

  _isNotEmpty(sourceValue) {
    return (
      sourceValue !== "" && sourceValue !== null && sourceValue !== undefined
    );
  }

  _includes(sourceValue, targetValues) {
    return targetValues.includes(sourceValue);
  }

  async validate(unvalidatedData = {}) {
    for (let key in unvalidatedData) {
      const sourceValue = unvalidatedData[key];

      for (let validationRule in this._schema[key]) {
        const targetValue = this._schema[key][validationRule];
        const validationResult = this[`_${validationRule}`](
          sourceValue,
          targetValue,
        );

        if (!validationResult) {
          const text = `Invalid value "${sourceValue}" in "${key}" property`;
          const error = new ValidationError(unvalidatedData.filePath, text);
          this._errors.push(error);
          break;
        }
      }
    }
  }
}

module.exports = Validator;
