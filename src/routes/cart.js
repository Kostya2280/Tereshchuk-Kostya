const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, cartController.getCart);
router.post('/add', isAuthenticated, cartController.addToCart);
router.get('/remove/:index', isAuthenticated, cartController.removeFromCart);
router.get('/clear', isAuthenticated, cartController.clearCart);
router.post('/pay/:index', isAuthenticated, cartController.updatePaymentStatus);

module.exports = router;