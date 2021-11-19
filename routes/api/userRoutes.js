const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.post('/camp-favorites/:id', userController.camp_add_favorites);
router.delete('/camp-favorites/:id', userController.camp_delete_favorites);
router.get('/camp-favorites', userController.camp_get_favorites);

module.exports = router;
