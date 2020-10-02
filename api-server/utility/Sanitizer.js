class Sanitizer {
  constructor(value) {
    this._value = value;
  }

  toString() {
    if (this._value === undefined || this._value === null) {
      this._value = null;
    } else if (typeof this._value !== "string") {
      this._value = String(this._value);
    }
    return this;
  }

  toExtension() {
    this._value = this._value.toLowerCase();
    if (this._value === ".flac") this._value = "flac";
    if (this._value === "mpeg 1 layer 3") this._value = "mp3";
    return this;
  }

  trim() {
    if (this._value === null) return this;
    else this._value = this._value.trim();
    return this;
  }

  toInt() {
    if (isNaN(parseInt(this._value))) this._value = null;
    return this;
  }

  toFloat() {
    if (this._value === undefined || this._value === null) {
      this._value = null;
      return this;
    } else {
      this._value = parseFloat(this.value);
      return this;
    }
  }

  toArr() {
    const isNull = this.value === null;
    const isUndefined = this._value === undefined;
    const isArray = Array.isArray(this._value);

    if (typeof this._value === "string") this._value = [this._value];
    if ((isArray && this._value.length === 0) || isUndefined || isNull) {
      this._value = [null];
    }

    return this;
  }

  get value() {
    return this._value;
  }
}

module.exports = Sanitizer;
