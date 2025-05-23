const Ticket = require('../models/Ticket');
const User = require('../models/User');

/**
 * Creates a local confirmation record for a ticket purchase
 * @param {string} userId - The ID of the user who bought the ticket
 * @param {Object} ticket - The ticket object
 * @param {Object} performance - The performance object

exports.createConfirmation = async (userId, ticket, performance) => {
    try {
        ticket.confirmationDate = new Date();
        ticket.confirmationNumber = generateConfirmationNumber();
        await ticket.save();

        return ticket;
    } catch (error) {
        console.error('Error creating confirmation:', error);
        throw error;
    }
};

/**
 * Generates a unique confirmation number for tickets
 * @returns {string} A unique confirmation number
 */
function generateConfirmationNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TKT-${timestamp.slice(-6)}-${random}`;
}