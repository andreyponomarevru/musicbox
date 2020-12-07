import { styleCamelCase } from "./../utility/helpers";

export function parseRequestInt(value: unknown) {
  const r = typeof value === "string" ? value : undefined;
  return r;
}

export function parseRequestSortParams(value: unknown) {
  const sortParams = typeof value === "string" ? value.split(",") : undefined;
  const sortBy = sortParams ? styleCamelCase(sortParams[0]) : undefined;
  const sortOrder = sortParams ? styleCamelCase(sortParams[1]) : undefined;

  return { sortBy, sortOrder };
}
