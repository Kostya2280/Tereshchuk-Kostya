const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render('auth/login', { title: 'Вхід' });
};

exports.getRegister = (req, res) => {
    res.render('auth/register', { title: 'Реєстрація' });
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('auth/login', {
                title: 'Вхід',
                error: 'Невірний email або пароль'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('auth/login', {
                title: 'Вхід',
                error: 'Невірний email або пароль'
            });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };

        res.redirect('/profile');
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Вхід',
            error: 'Помилка входу. Спробуйте пізніше.'
        });
    }
};

exports.postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Реєстрація',
                error: 'Користувач з таким email вже існує'
            });
        }

        const user = new User({ name, email, password });
        await user.save();

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };

        res.redirect('/profile');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            title: 'Реєстрація',
            error: 'Помилка реєстрації. Спробуйте пізніше.'
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};