class Sanitizer {
  toStr() {
    if (typeof this._name !== "string") this._value = "";
    return this;
  }

  toExtension() {
    this._value = this._value.toLowerCase();
    if (this._value === ".flac") this._value = "flac";
    if (this._value === "mpeg 3 layer-1") this._value = "mp3";
    return this;
  }

  trim() {
    this._value = this._value.trim();
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
    }
    this._value = parseFloat(this.value.replace(",", "."));
    return this;
  }

  toNull() {
    if (this._value === undefined) this._value = null;
    return this;
  }

  toArr() {
    if (this._value === undefined || this.value === null) this._value = null;
    return [this._value];
  }

  get value() {
    return this._value;
  }

  static sanitize(value) {
    this._value = value;
    return new Sanitizer();
  }
}

//const parser = new MetadataParser();
//console.log(parser.parse(" Future Sound Of London  ", "artist"));

//"/mnt/CE64EB6A64EB53AD/temp-files/[PALMS003] Rudolf C - Goin' Good (EP) WEB [2017] 320Kbps/02 No Fuss.mp3")
//  .then(res => console.log(res))
//  .catch(err => console.error(err));

module.exports = Sanitizer;
