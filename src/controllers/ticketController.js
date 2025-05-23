const Performance = require('../models/Performance');
const Ticket = require('../models/Ticket');
const confirmationService = require('../utils/confirmationService');
const emailService = require('../utils/emailService');
const User = require('../models/User');

exports.getTickets = async (req, res) => {
    try {
        const performances = await Performance.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .exec();
        
        res.render('tickets/index', {
            title: 'Купити квитки',
            performances
        });
    } catch (error) {
        console.error('Error fetching performances:', error);
        res.status(500).render('error', { error: 'Помилка при завантаженні вистав' });
    }
};

exports.getBookTickets = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).render('error', { error: 'Виставу не знайдено' });
        }

        // Get all cart items for this performance to check reserved seats
        const cartItems = req.session.cart ? req.session.cart.filter(item => 
            item.performanceId.toString() === performance._id.toString()
        ) : [];

        res.render('tickets/book', {
            title: 'Бронювання квитків',
            performance,
            cartItems,
            error: null
        });
    } catch (error) {
        console.error('Error fetching performance:', error);
        res.status(500).render('error', { error: 'Помилка при завантаженні інформації' });
    }
};

exports.postBookTickets = async (req, res) => {
    try {
        const { fullName, quantity, selectedSeats } = req.body;
        const performanceId = req.params.id;
        const userId = req.session.user.id;

        const performance = await Performance.findById(performanceId);
        if (!performance) {
            return res.status(404).render('error', { error: 'Виставу не знайдено' });
        }

        if (performance.currentIteration >= performance.iterationLimit) {
            return res.render('tickets/book', {
                title: 'Бронювання квитків',
                performance,
                error: 'Досягнуто ліміт ітерацій для цієї вистави'
            });
        }

        const seats = JSON.parse(selectedSeats);
        if (seats.length !== parseInt(quantity)) {
            return res.render('tickets/book', {
                title: 'Бронювання квитків',
                performance,
                error: 'Кількість вибраних місць не відповідає кількості квитків'
            });
        }

        const seatIndexes = seats.map(seat => 
            performance.seats.findIndex(s => 
                s.row === seat.row && s.seat === seat.seat && !s.isBooked
            )
        );

        if (seatIndexes.includes(-1)) {
            return res.render('tickets/book', {
                title: 'Бронювання квитків',
                performance,
                error: 'Деякі з вибраних місць вже заброньовані'
            });
        }

        seatIndexes.forEach(index => {
            performance.seats[index].isBooked = true;
        });

        performance.availableTickets -= seats.length;
        await performance.save();

        const ticket = new Ticket({
            performance: performanceId,
            user: userId,
            fullName,
            seats,
            quantity: parseInt(quantity),
            totalPrice: performance.ticketPrice * parseInt(quantity)
        });

        await ticket.save();

        const user = await User.findById(userId);
        if (user && user.email) {
            try {
                await emailService.sendTicketConfirmation(user.email, ticket, performance);
                
                await confirmationService.createConfirmation(userId, ticket, performance);
            } catch (error) {
                console.error('Error sending confirmations:', error);
            }
        }

        res.redirect('/tickets/confirmation/' + ticket._id);
    } catch (error) {
        console.error('Error booking tickets:', error);
        res.status(500).render('error', { error: 'Помилка при бронюванні квитків' });
    }
};

exports.getTicketConfirmation = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('performance');
        if (!ticket) {
            return res.status(404).render('error', { error: 'Квиток не знайдено' });
        }

        res.render('tickets/confirmation', {
            title: 'Підтвердження бронювання',
            ticket
        });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).render('error', { error: 'Помилка при завантаженні інформації' });
    }
};