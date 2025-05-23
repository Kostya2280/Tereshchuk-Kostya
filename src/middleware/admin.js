exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    res.status(403).render('error', {
        title: 'Помилка доступу',
        error: 'У вас немає прав для доступу до цієї сторінки'
    });
};