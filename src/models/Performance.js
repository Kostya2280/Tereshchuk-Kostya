const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    row: Number,
    seat: Number,
    isBooked: {
        type: Boolean,
        default: false
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

const performanceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    iterationLimit: {
        type: Number,
        default: 1
    },
    currentIteration: {
        type: Number,
        default: 0
    },
    artists: [{
        name: String,
        role: String
    }],
    program: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: '/images/default-opera.jpg'
    },
    totalTickets: {
        type: Number,
        default: 500 
    },
    availableTickets: {
        type: Number,
        default: 500
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    seats: {
        type: [seatSchema],
        default: function() {
            const seats = [];
            for(let row = 1; row <= 20; row++) {
                for(let seat = 1; seat <= 25; seat++) {
                    seats.push({
                        row: row,
                        seat: seat,
                        isBooked: false,
                        isPaid: false
                    });
                }
            }
            return seats;
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);