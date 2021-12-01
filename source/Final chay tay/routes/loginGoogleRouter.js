const Router = require('express').Router();
const passport = require('passport')
// Router.get('/login', (req, res) => {
//     res.render('login', { user: req.user });
// });
Router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));

// Router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//     res.redirect('/profile');
// });
Router.get('/google/callback', passport.authenticate('google', {
        successRedirect : '/student',
        failureRedirect: '/login' 
}));
module.exports = Router;