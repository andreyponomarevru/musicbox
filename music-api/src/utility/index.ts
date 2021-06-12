import path from "path";

const IMG_DIR = process.env.IMG_DIR!;

export function hyphenToUpperCase(str: string) {
  function format(match: any, offset: any, string: string) {
    return offset > 0 ? string[offset + 1].toUpperCase() : "";
  }
  return str.replace(/-[a-z0-9]{0,1}/g, format);
}

export function getExtensionName(nodePath: string): string {
  return path.extname(nodePath).slice(1).toLowerCase();
}

export function buildApiCoverPath(filename: string) {
  return `${path.basename(IMG_DIR)}/${filename}`;
}

export function buildLocalCoverPath(filename: string) {
  return `${IMG_DIR}/${filename}`;
}
