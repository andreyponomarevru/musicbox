async function traverseDir(dirPath, arrayOfFiles = []) {
  const fileSystemNodes = await fs.readdir(dirPath);

  for (let fileSystemNode of fileSystemNodes) {
    const nodePath = path.join(dirPath, fileSystemNode);
    const nodeStats = await fs.stat(nodePath);

    if (nodeStats.isDirectory()) await traverseDir(nodePath, arrayOfFiles);
    else arrayOfFiles.push(nodePath);
  }

  return arrayOfFiles;
}

module.exports = traverseDir;
