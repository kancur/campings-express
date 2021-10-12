var express = require('express');
var router = express.Router();
var api = require('./api/v1/index')

router.use('/api/v1', api);

router.get('/', function(req, res, next) {
  res.send('API by Peter');
});

module.exports = router;
