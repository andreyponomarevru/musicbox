const fs = require("fs-extra");
const ValidationError = require("./ValidationError.js");

class Validator {
  constructor(value) {
    this._value = value;
    this._error = [];
  }

  get error() {
    return this._error;
  }

  isRange(from, to) {
    if (!(this._value >= from && this._value <= to)) {
      const error = new ValidationError(
        "isRange",
        `${this._value} is not in range ${from}-${to}`,
      );
      this._error.push(error);
    }
    return this;
  }

  isLength(min, max) {
    if (!(this._value.length >= min && this._value.length <= max)) {
      this._error.push({
        origin: "isRange",
        message: `${this._value} is not length ${max}`,
      });
    }
    return this;
  }

  isPositive() {
    if (!(this._value > 0))
      this._error.push({
        origin: "isPositive",
        message: `${this._value} is not positive`,
      });
    return this;
  }

  isArr() {
    if (!Array.isArray(this._value))
      this._error.push({
        origin: "isArr",
        message: `${this._value} is not an array`,
      });
    return this;
  }

  isNotEmpty() {
    if (
      this._value === "" ||
      this._value === null ||
      typeof this._value !== undefined
    ) {
      this._error.push({
        origin: "isNotEmpty",
        message: `${this._value} is empty`,
      });
    }
    return this;
  }

  isDiskNo() {
    if (
      this._value === null ||
      typeof this._value === "string" ||
      typeof this._value === "number"
    )
      return this;
    else {
      this._error.push({
        origin: "isDiskNo",
        message: `${this._value} is incorrect disk number`,
      });
    }
  }

  isTrackNo() {
    this.isDiskNo();
  }

  isFloat() {
    if (isNaN(Number.parseFloat(this._value))) {
      this._error.push({
        origin: "isFloat",
        message: `${this._value} is not a float`,
      });
    }
    return this;
  }

  isInt() {
    if (!Number.isSafeInteger(this._value)) {
      this._error.push({
        origin: "isInt",
        message: `${this._value} is not an integer`,
      });
    }
    return this;
  }

  isStr() {
    if (typeof this._value !== "string") {
      this._error.push({
        origin: "isString",
        message: `${this._value} is not a string`,
      });
    }
    return this;
  }

  isYear() {
    const re = /^([0-9]){4}$/;
    if (!(this._value > 0 && re.test(this._value))) {
      this.error.push({
        origin: "isYear",
        message: `${this._value} is incorrect year`,
      });
    }
    return this;
  }

  isSupportedValue(supportedValues) {
    if (!supportedValues.includes(this._value)) {
      this._error.push({
        origin: "isSupportedValue",
        message: `${supportedValues} is not supported value`,
      });
    }
    return this;
  }

  static setSchema(schema) {
    this._schema = schema;

    return new Validator();
  }

  async validate(props) {
    for (let prop in props) {
      console.log(prop);
    }
  }
}

module.exports = Validator;
