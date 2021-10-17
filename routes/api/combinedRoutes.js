const express = require('express');
const router = express.Router();
const combinedController = require('../../controllers/combinedController')

/* GET home page. */
router.get('/list', combinedController.combined_list);


module.exports = router;
