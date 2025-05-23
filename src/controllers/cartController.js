const Performance = require('../models/Performance');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const emailService = require('../utils/emailService');

exports.getCart = async (req, res) => {
    try {
        if (!req.session.cart) {
            req.session.cart = [];
        }

        const cartItems = [];
        for (const item of req.session.cart) {
            const performance = await Performance.findById(item.performanceId);
            if (performance) {
                cartItems.push({
                    ...item,
                    performance
                });
            }
        }

        const total = cartItems.reduce((sum, item) => sum + (item.performance.ticketPrice * item.seats.length), 0);

        res.render('cart/index', {
            title: 'Корзина',
            cartItems,
            total
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).render('error', { error: 'Помилка при завантаженні корзини' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { performanceId, seats } = req.body;
        
        if (!req.session.cart) {
            req.session.cart = [];
        }

        if (!performanceId) {
            return res.status(400).json({ error: 'Відсутній ID вистави' });
        }

        if (!seats) {
            return res.status(400).json({ error: 'Відсутні вибрані місця' });
        }

        try {
            const seatsArray = typeof seats === 'string' ? JSON.parse(seats) : seats;
            
            if (!Array.isArray(seatsArray)) {
                return res.status(400).json({ error: 'Неправильний формат місць' });
            }

            const performance = await Performance.findById(performanceId);
            if (!performance) {
                return res.status(404).json({ error: 'Виставу не знайдено' });
            }

            const cartItem = {
                performanceId,
                seats: seatsArray,
                isPaid: false
            };

            req.session.cart.push(cartItem);

            const user = await User.findById(req.session.user.id);
            if (user && user.email) {
                try {
                    await emailService.sendCartTicketConfirmation(user.email, cartItem, performance);
                } catch (emailError) {
                    console.error('Error sending email confirmation:', emailError);
                }
            }

            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            res.json({ 
                success: true, 
                cartCount: req.session.cart.filter(item => !item.isPaid).length,
                cartItems: req.session.cart
            });

        } catch (parseError) {
            return res.status(400).json({ error: 'Помилка при обробці даних місць' });
        }

    } catch (error) {
        res.status(500).json({ 
            error: 'Помилка при додаванні до корзини',
            details: error.message 
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { index } = req.params;
        
        if (!req.session.cart) {
            return res.status(404).json({ error: 'Корзина порожня' });
        }

        if (index >= 0 && index < req.session.cart.length) {
            req.session.cart.splice(index, 1);
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const unpaidCount = req.session.cart.filter(item => !item.isPaid).length;
            res.json({ 
                success: true, 
                cartCount: unpaidCount
            });
        } else {
            res.status(404).json({ error: 'Елемент не знайдено' });
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Помилка при видаленні з корзини' });
    }
};

exports.clearCart = (req, res) => {
    req.session.cart = [];
    req.session.save((err) => {
        if (err) {
            console.error('Error saving session:', err);
        }
        res.redirect('/cart');
    });
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        
        if (!req.session.cart || !req.session.cart[index]) {
            return res.status(404).json({ error: 'Квиток не знайдено' });
        }

        const cartItem = req.session.cart[index];
        const performance = await Performance.findById(cartItem.performanceId);
        
        if (!performance) {
            return res.status(404).json({ error: 'Виставу не знайдено' });
        }

        cartItem.seats.forEach(seatToMark => {
            const seatIndex = performance.seats.findIndex(
                s => s.row === seatToMark.row && s.seat === seatToMark.seat
            );
            if (seatIndex !== -1) {
                performance.seats[seatIndex].isPaid = true;
            }
        });
        await performance.save();

        const ticket = new Ticket({
            performance: cartItem.performanceId,
            user: req.session.user.id,
            seats: cartItem.seats,
            quantity: cartItem.seats.length,
            totalPrice: performance.ticketPrice * cartItem.seats.length,
            isPaid: true,
            fullName: req.session.user.name
        });

        await ticket.save();

        req.session.cart[index].isPaid = true;
        req.session.cart[index].ticketId = ticket._id;

        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Помилка при оновленні статусу оплати' });
    }
};