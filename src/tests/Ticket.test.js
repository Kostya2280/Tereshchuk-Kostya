const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Performance = require('../models/Performance');

describe('Ticket Model Test', () => {
    let user, performance;

    beforeEach(async () => {
        user = await User.create({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password123'
        });

        performance = await Performance.create({
            title: 'Test Performance',
            date: new Date('2025-12-25'),
            time: '19:00',
            venue: 'Test Opera House',
            program: 'Test Program',
            ticketPrice: 500
        });
    });

    const ticketData = {
        fullName: 'Test User',
        seats: [
            { row: 1, seat: 1 },
            { row: 1, seat: 2 }
        ],
        quantity: 2,
        totalPrice: 1000
    };

    it('should create a new ticket successfully', async () => {
        const ticket = await Ticket.create({
            ...ticketData,
            performance: performance._id,
            user: user._id
        });

        expect(ticket.fullName).toBe(ticketData.fullName);
        expect(ticket.seats.length).toBe(2);
        expect(ticket.quantity).toBe(ticketData.quantity);
        expect(ticket.totalPrice).toBe(ticketData.totalPrice);
        expect(ticket.isPaid).toBe(false);
    });

    it('should validate required fields', async () => {
        let err;
        try {
            await Ticket.create({
                fullName: 'Test User'
            });
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.performance).toBeDefined();
        expect(err.errors.user).toBeDefined();
        expect(err.errors.quantity).toBeDefined();
        expect(err.errors.totalPrice).toBeDefined();
    });

    it('should set confirmation details correctly', async () => {
        const ticket = await Ticket.create({
            ...ticketData,
            performance: performance._id,
            user: user._id
        });

        const confirmationDate = new Date();
        ticket.confirmationDate = confirmationDate;
        ticket.confirmationNumber = 'TKT-123456-7890';
        await ticket.save();

        const updatedTicket = await Ticket.findById(ticket._id);
        expect(updatedTicket.confirmationNumber).toBe('TKT-123456-7890');
        expect(updatedTicket.confirmationDate).toStrictEqual(confirmationDate);
    });

    it('should update payment status correctly', async () => {
        const ticket = await Ticket.create({
            ...ticketData,
            performance: performance._id,
            user: user._id
        });

        ticket.isPaid = true;
        await ticket.save();

        const updatedTicket = await Ticket.findById(ticket._id);
        expect(updatedTicket.isPaid).toBe(true);
    });
});