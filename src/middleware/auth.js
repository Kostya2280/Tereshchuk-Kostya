exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

exports.redirectIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    next();
};