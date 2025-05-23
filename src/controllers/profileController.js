exports.getProfile = (req, res) => {
    res.render('profile', {
        title: 'Профіль користувача',
        user: req.session.user
    });
};