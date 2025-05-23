const Performance = require('../models/Performance');

exports.getAddPerformance = (req, res) => {
    res.render('admin/add-performance', { 
        title: 'Додати виставу',
        error: null
    });
};

exports.postAddPerformance = async (req, res) => {
    try {
        const { title, date, time, venue, program, ticketPrice } = req.body;
        const artists = JSON.parse(req.body.artists || '[]');

        const performance = new Performance({
            title,
            date,
            time,
            venue,
            artists,
            program,
            ticketPrice: parseFloat(ticketPrice)
        });

        await performance.save();
        res.redirect('/performances');
    } catch (error) {
        console.error('Error adding performance:', error);
        res.render('admin/add-performance', {
            title: 'Додати виставу',
            error: 'Помилка при додаванні вистави. Будь ласка, перевірте введені дані.'
        });
    }
};

exports.deletePerformance = async (req, res) => {
    try {
        const { id } = req.params;
        await Performance.findByIdAndDelete(id);
        res.status(200).json({ message: 'Виставу успішно видалено' });
    } catch (error) {
        console.error('Error deleting performance:', error);
        res.status(500).json({ error: 'Помилка при видаленні вистави' });
    }
};

exports.getEditPerformance = async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).render('error', {
                title: 'Помилка',
                error: 'Виставу не знайдено'
            });
        }
        
        res.render('admin/edit-performance', {
            title: 'Редагувати виставу',
            performance,
            error: null
        });
    } catch (error) {
        console.error('Error fetching performance:', error);
        res.status(500).render('error', {
            title: 'Помилка',
            error: 'Помилка при завантаженні вистави'
        });
    }
};

exports.postEditPerformance = async (req, res) => {
    try {
        const { title, date, time, venue, program, imageUrl, ticketPrice } = req.body;
        const artists = JSON.parse(req.body.artists || '[]');

        const performance = await Performance.findById(req.params.id);
        if (!performance) {
            return res.status(404).render('error', {
                title: 'Помилка',
                error: 'Виставу не знайдено'
            });
        }

        performance.title = title;
        performance.date = date;
        performance.time = time;
        performance.venue = venue;
        performance.artists = artists;
        performance.program = program;
        performance.ticketPrice = parseFloat(ticketPrice);
        if (imageUrl) performance.imageUrl = imageUrl;

        await performance.save();
        res.redirect('/performances');
    } catch (error) {
        console.error('Error updating performance:', error);
        res.render('admin/edit-performance', {
            title: 'Редагувати виставу',
            performance: { ...req.body, _id: req.params.id },
            error: 'Помилка при оновленні вистави. Перевірте введені дані.'
        });
    }
};