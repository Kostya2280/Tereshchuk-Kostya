const Performance = require('../models/Performance');

describe('Performance Model Test', () => {
    const performanceData = {
        title: 'Test Performance',
        date: new Date('2025-12-25'),
        time: '19:00',
        venue: 'Test Opera House',
        artists: [
            { name: 'John Doe', role: 'Main Actor' },
            { name: 'Jane Smith', role: 'Supporting Actor' }
        ],
        program: 'Test Program Description',
        ticketPrice: 500
    };

    it('should create a new performance successfully', async () => {
        const performance = await Performance.create(performanceData);
        expect(performance.title).toBe(performanceData.title);
        expect(performance.venue).toBe(performanceData.venue);
        expect(performance.ticketPrice).toBe(performanceData.ticketPrice);
    });

    it('should generate default seat layout', async () => {
        const performance = await Performance.create(performanceData);
        expect(performance.seats.length).toBe(500);
        expect(performance.totalTickets).toBe(500);
        expect(performance.availableTickets).toBe(500);
    });

    it('should validate required fields', async () => {
        const invalidPerformance = {
            title: 'Test Performance',
        };
        let err;
        try {
            await Performance.create(invalidPerformance);
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.date).toBeDefined();
        expect(err.errors.time).toBeDefined();
        expect(err.errors.venue).toBeDefined();
        expect(err.errors.program).toBeDefined();
        expect(err.errors.ticketPrice).toBeDefined();
    });

    it('should correctly handle seat booking', async () => {
        const performance = await Performance.create(performanceData);
        const seatToBook = performance.seats[0];
        seatToBook.isBooked = true;
        await performance.save();

        const updatedPerformance = await Performance.findById(performance._id);
        expect(updatedPerformance.seats[0].isBooked).toBe(true);
    });
});