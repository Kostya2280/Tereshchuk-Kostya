require('dotenv').config();
const mongoose = require('mongoose');
const Performance = require('../src/models/Performance');

const updatePerformanceSeats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const performances = await Performance.find();
        
        for (const performance of performances) {
            // Create new seats array with numbers 1-25
            const newSeats = [];
            for(let row = 1; row <= 20; row++) {
                for(let seat = 1; seat <= 25; seat++) {
                    newSeats.push({
                        row: row,
                        seat: seat,
                        isBooked: false
                    });
                }
            }
            
            // Update performance while preserving existing fields
            const updatedPerformance = {
                ...performance.toObject(),
                seats: newSeats,
                totalTickets: 500,
                availableTickets: 500
            };

            // Use findByIdAndUpdate to update the document
            await Performance.findByIdAndUpdate(
                performance._id,
                updatedPerformance,
                { new: true, runValidators: false }
            );
        }

        console.log('Successfully updated seat layouts for all performances');
        process.exit(0);
    } catch (error) {
        console.error('Error updating performances:', error);
        process.exit(1);
    }
};

updatePerformanceSeats();