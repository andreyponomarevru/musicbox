var express = require('express');
var router = express.Router();
const http = require('http');

router.get('/', (req, res, next) => {
  /*
  const httpreq = http.request({
    host: 'localhost',
    port: process.env.SERVERPORT,
    path: '/api',
    method: 'GET'
  });
  
  httpreq.on('response', (response) => {
    response.on('data', (chunk) => {
      const data = JSON.parse(chunk);
      console.log(data);
      res.end();
    });
  });
  */
});

module.exports = router;

