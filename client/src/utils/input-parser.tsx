import { toSec } from "./utils";

export class InputParser {
  number(number: unknown) {
    const num = Number(number);
    if (isNaN(num) || num === 0) return 0;
    else return num;
  }

  string(str: unknown) {
    if (typeof str === "string") {
      return str.trim();
    } else {
      return "";
    }
  }

  seconds(minSec: unknown) {
    if (typeof minSec === "string") {
      if (!minSec.includes(":")) return 0;
      const parsedMinSec = minSec.split(":");
      if (minSec[1] === "" || minSec[0] === "") return 0;
      const min = Number(parsedMinSec[0]);
      const sec = Number(parsedMinSec[1]);
      if (isNaN(min) || isNaN(sec)) return 0;

      return toSec(min, sec);
    } else {
      return 0;
    }
  }

  array(name: unknown) {
    if (typeof name === "string") {
      return name.split("; ");
    } else {
      return [];
    }
  }
}
