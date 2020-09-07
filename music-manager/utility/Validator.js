const fs = require("fs-extra");
const ValidationError = require("./ValidationError.js");

class Validator {
  constructor(schema) {
    this._schema = schema;
    this._error = [];
  }

  get error() {
    return this._error;
  }

  isType(sourceValue, targetValue = []) {
    for (let value of targetValue) {
      if (value === "array") return Array.isArray(sourceValue);
      else {
        sourceValue = sourceValue === null ? null : typeof sourceValue;
        return targetValue.includes(sourceValue);
      }
    }
  }

  isRequired(sourceValue, targetValue) {
    return !!sourceValue === targetValue;
  }

  isLength(sourceValue, { min, max }) {
    return sourceValue.length >= min && sourceValue.length <= max;
  }

  isRange(sourceValue, { min, max }) {
    return sourceValue >= min && sourceValue <= max;
  }

  isNotEmpty(sourceValue) {
    return (
      sourceValue !== "" && sourceValue !== null && sourceValue !== undefined
    );
  }

  isFloat(sourceValue, targetValue) {
    return !!Number.parseFloat(sourceValue) === targetValue;
  }

  includes(sourceValue, targetValue) {
    return targetValue.includes(sourceValue);
  }

  async validate(dataForValidation) {
    for (let key in dataForValidation) {
      const sourceValue = dataForValidation[key];
      //this[rule](validValue, this._schema[key]);
      for (let validationRule in this._schema[key]) {
        const targetValue = this._schema[key][validationRule];
        console.log(this[validationRule](sourceValue, targetValue));
        //if (!targetValue)
        //  this._error.push(new ValidationError(dataForValidation.filePath, ``));
      }
    }
  }
}

module.exports = Validator;
