const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', performanceController.getAllPerformances);
router.get('/performances', performanceController.getAllPerformances);

router.get('/profile', isAuthenticated, profileController.getProfile);

module.exports = router;