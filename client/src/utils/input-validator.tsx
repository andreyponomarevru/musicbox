export class InputValidator {
  number(number: number, schema = { min: 1, max: 100 }) {
    return number > schema.max || number < schema.min ? false : true;
  }

  string(title: string, schema = { min: 1, max: 100 }) {
    return title.length > schema.max || title.length < schema.min
      ? false
      : true;
  }

  array(
    names: string[],
    schema = { type: "string", items: { min: 1, max: 100 } }
  ) {
    if (
      names.every((str) => typeof str !== schema.type) ||
      names.length === 0 ||
      names.includes("")
    ) {
      return false;
    }

    return names.every((name) => {
      if (name.length > schema.items.max || name.length < schema.items.min) {
        return false;
      } else {
        return true;
      }
    });
  }

  duration(duration: number) {
    return typeof duration === "number" && duration > 0 && duration < 99999
      ? true
      : false;
  }
}
