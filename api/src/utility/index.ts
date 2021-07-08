import path from "path";

const IMG_DIR = process.env.IMG_DIR as string;

export function hyphenToUpperCase(str: string): string {
  function format(match: string, offset: number, string: string) {
    return offset > 0 ? string[offset + 1].toUpperCase() : "";
  }
  return str.replace(/-[a-z0-9]{0,1}/g, format);
}

export function getExtensionName(nodePath: string): string {
  return path.extname(nodePath).slice(1).toLowerCase();
}

export function buildImageURL(filename: string): string {
  const filepath = `${path.basename(IMG_DIR)}/${filename}`;
  return filepath;
}

export function buildImageFilePath(filename: string): string {
  const filepath = `${IMG_DIR}/${filename}`;
  return filepath;
}

export function parseFilterIDs(arr: unknown): number[] | null {
  if (Array.isArray(arr)) return arr.map((id) => parseInt(id));
  else return null;
}
