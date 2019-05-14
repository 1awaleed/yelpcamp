var express = require('express');
var router 	= express.Router();

// auth dependencies
var passport = require('passport');

// database model dependencies
var User = require('../models/user');

// routes setup
router.get('/', function (req, res) {
	res.render("landing");
});

// show register form
router.get('/register', function (req, res) {
	res.render('register');
});

// submit and handle signup logic
router.post('/register', function (req, res) {
	var newUser = new User({username: req.body.username});
	// create new user in database
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash('error', err.message);
			console.log(err);
			return res.render('register');
		} else {
			// log the user in
			passport.authenticate('local')(req, res, function () {
				req.flash('success', 'Thanks for signing up '+req.user.username);
				res.redirect('/campgrounds');
			})
		}
	});

});

// show login template
router.get('/login', function (req, res) {
	res.render('login');
});

// handel login logic
// passport.authenticate automatically gets req.body.username & passwords from the inputs
// and tries to login the user, the method is added when we used 
// passport.use(new LocalStrategy(User.authenticate())); on line 33
router.post('/login', passport.authenticate('local', 
	{
		successRedirect:'/campgrounds',
		faliureRedirect: '/login'
	}) , function (req, res) {
	
});

// logout route to check if the user is still logged in
router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success', 'You have logged out.');
	res.redirect('/campgrounds');
});

module.exports = router;