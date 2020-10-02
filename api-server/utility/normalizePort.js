function normalizePort(number) {
  var port = parseInt(number, 10);

  if (isNaN(port)) return number;
  if (port >= 0) return port;

  return false;
}

module.exports.normalizePort = normalizePort;
