import path from "path";

function getExtensionName(nodePath: string): string {
  return path.extname(nodePath).slice(1).toLowerCase();
}

export { getExtensionName };
