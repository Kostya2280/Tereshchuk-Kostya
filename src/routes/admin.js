const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/admin');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

router.get('/performances/add', adminController.getAddPerformance);
router.post('/performances/add', adminController.postAddPerformance);
router.get('/performances/edit/:id', adminController.getEditPerformance);
router.post('/performances/edit/:id', adminController.postEditPerformance);
router.delete('/performances/:id', adminController.deletePerformance);

module.exports = router;