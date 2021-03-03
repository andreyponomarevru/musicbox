import path from "path";

import { IMG_DIR_URL, IMG_LOCAL_DIR } from "./../utility/constants";

export function styleCamelCase(str: string) {
  function hypenToUpperCase(match: any, offset: any, string: string) {
    console.log(match, offset, string);
    return offset > 0 ? string[offset + 1].toUpperCase() : "";
  }
  return str.replace(/-[a-z0-9]{0,1}/g, hypenToUpperCase);
}

export function getExtensionName(nodePath: string): string {
  return path.extname(nodePath).slice(1).toLowerCase();
}

export function buildApiCoverPath(filename: string) {
  return `${IMG_DIR_URL}/${filename}`;
}

export function buildLocalCoverPath(filename: string) {
  return `${IMG_LOCAL_DIR}/${filename}`;
}
