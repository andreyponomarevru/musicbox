class Sanitizer<TOutput> {
  private input: unknown;

  constructor(input: unknown = null) {
    this.input = input;
  }

  get value(): TOutput | null {
    return this.input as TOutput;
  }

  normalizeExtension() {
    if (typeof this.input === "string") {
      this.input = this.input.toLowerCase();
      if (this.input === "mpeg 1 layer 3") this.input = "mp3";
    }
    return this;
  }

  toStr() {
    this.input =
      typeof this.input === "string" && this.input.trim().length > 0
        ? this.input.trim()
        : "";
    return this;
  }

  toBool() {
    this.input =
      typeof this.input === "boolean" && this.input === true ? true : false;
    return this;
  }

  toArr() {
    this.input =
      typeof this.input === "object" && Array.isArray(this.input)
        ? this.input
        : [];
    return this;
  }

  toNumInt() {
    this.input =
      typeof this.input === "number" && this.input % 1 === 0 ? this.input : 0;
    return this;
  }

  toObj() {
    this.input =
      typeof this.input === "object" && this.input !== null ? this.input : {};
    return this;
  }
}

export { Sanitizer };
