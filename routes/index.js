var express = require('express');
var router = express.Router();
var api = require('./api/index')

router.use('/api', api);

router.get('/', function(req, res, next) {
  res.send('API by Peter');
});

module.exports = router;
