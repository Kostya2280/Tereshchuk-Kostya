require('dotenv').config();
const mongoose = require('mongoose');
const Performance = require('../src/models/Performance');

const addTestPerformance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const testPerformance = new Performance({
            title: 'Лускунчик',
            date: new Date('2025-12-25'), // Future date
            time: '19:00',
            venue: 'Оперний театр',
            artists: [
                { name: 'Марія Петренко', role: 'Клара' },
                { name: 'Іван Ковальчук', role: 'Лускунчик-принц' }
            ],
            program: 'Класичний балет-феєрія на 2 дії',
            ticketPrice: 500,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Nutcracker_Mariinsky_2012.jpg'
        });

        await testPerformance.save();
        console.log('Test performance added successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error adding test performance:', error);
        process.exit(1);
    }
};

addTestPerformance();