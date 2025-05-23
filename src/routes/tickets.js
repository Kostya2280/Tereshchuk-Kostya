const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', ticketController.getTickets);
router.get('/book/:id', isAuthenticated, ticketController.getBookTickets);
router.post('/book/:id', isAuthenticated, ticketController.postBookTickets);
router.get('/confirmation/:id', isAuthenticated, ticketController.getTicketConfirmation);

module.exports = router;