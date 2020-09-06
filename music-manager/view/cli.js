const readline = require("readline");



const readlineInterface1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askLibPath() {
  return new Promise((resolve) => {
    readlineInterface1.question("Enter a path to your music library: ", (libDirPath) => {
      readlineInterface1.close();
      resolve(libDirPath);
    });
  });
}



module.exports.askLibPath = askLibPath;
