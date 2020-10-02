var express = require('express');
var router = express.Router();

// GET home page. 
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
  res.end();
});

module.exports = router;
