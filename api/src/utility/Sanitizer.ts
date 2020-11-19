class Sanitizer<TOutput> {
  private input: unknown;

  constructor(input: unknown = null) {
    this.input = input;
  }

  trim() {
    if (this.input === null) return this;

    if (typeof this.input === "string") {
      (this.input as string) = this.input.trim();
    } else {
      this.input = null;
    }
    return this;
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
}

export { Sanitizer };
