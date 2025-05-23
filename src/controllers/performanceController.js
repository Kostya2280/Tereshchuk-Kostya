const Performance = require('../models/Performance');

exports.getAllPerformances = async (req, res) => {
    try {
        const { title, city, date } = req.query;
        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (city) {
            query.venue = { $regex: city, $options: 'i' };
        }
        if (date) {
            const selectedDate = new Date(date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            query.date = {
                $gte: selectedDate,
                $lt: nextDay
            };
        }

        const performances = await Performance.find(query)
            .sort({ date: 1 })
            .exec();

        res.render('performances/index', {
            title: 'Вистави',
            performances,
            searchParams: { title, city, date }
        });
    } catch (error) {
        console.error('Error fetching performances:', error);
        res.status(500).render('error', { 
            error: 'Помилка при завантаженні вистав' 
        });
    }
};

exports.createPerformance = async (req, res) => {
    try {
        const newPerformance = new Performance(req.body);
        await newPerformance.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error creating performance:', error);
        res.status(400).json({ error: error.message });
    }
};