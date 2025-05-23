const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    performance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Performance',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    seats: [{
        row: Number,
        seat: Number
    }],
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    confirmationNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    confirmationDate: {
        type: Date
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);