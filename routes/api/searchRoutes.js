const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/searchController')

router.get('/', searchController.search_get);
router.get('/camps', searchController.fulltext_camp_search)

module.exports = router;
