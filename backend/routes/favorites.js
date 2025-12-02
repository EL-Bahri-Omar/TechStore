const express = require('express');
const router = express.Router();
const { toggleFavorite, getUserFavorites, checkFavorite } = require('../controllers/favoritesController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/favorites/:productId')
    .post(isAuthenticatedUser, toggleFavorite)
    .get(isAuthenticatedUser, checkFavorite);

router.route('/favorites')
    .get(isAuthenticatedUser, getUserFavorites);

module.exports = router;