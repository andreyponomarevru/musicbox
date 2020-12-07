export function replaceSpaces(str: string) {
  return str.replace(/\s/g, "_");
}

export function styleCamelCase(str: string) {
  function hypenToUpperCase(match: any, offset: any, string: string) {
    console.log(match, offset, string);
    return offset > 0 ? string[offset + 1].toUpperCase() : "";
  }
  return str.replace(/-[a-z0-9]{0,1}/g, hypenToUpperCase);
}
