var express = require('express');
var router = express.Router();

// database model dependencies
var Campground	= require('../models/campground');

// middleware functions
var middleware = require('../middleware');

// index - show all campgrounds
router.get('/', function (req, res) {
	// get all campgrounds from mongoose db
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			// Pass all database to the frontend
			res.render('campgrounds/index',{campgrounds:allCampgrounds});
		}
	});
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
	res.render('campgrounds/new');
});

//CREATE - add new campground to db
router.post('/', middleware.isLoggedIn, function (req, res) {
	// get data from form
	var name	= req.body.name;
	var price 	= req.body.price;
	var image 	= req.body.image;
	var desc 	= req.body.description;
	var author 	= {
		id:			req.user._id,
		username:	req.user.username
	}

	var newCampground = {name: name, price: price, image: image, description: desc, author:author};
	// create new campground and save to db
	Campground.create(newCampground, function (err, newlyCreatedCampground) {
		if (err) {
			console.log(err);
		} else {
			// add author to the campground
			newlyCreatedCampground.author.id = req.user._id;
			newlyCreatedCampground.author.username = req.user.username;
			// save campground
			newlyCreatedCampground.save();
			// redirect back to campgrounds
			res.redirect('/campgrounds');
		}
	});
});

//SHOW - show info about specific campground
router.get('/:id', function (req, res) {
	// find campground with provided id & pass it to show template
	Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
		if (err || !foundCampground) {
			req.flash('error', 'Campground not found');
			console.log(err);
		} else {
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});

});

// EDIT campground - show edit forum
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err, foundCampground) {
		res.render('campgrounds/edit', {campground:foundCampground});
	}) 
});

// UPDATE campground - save the update to db
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
	//find and update correct campground
	Campground.findById(req.params.id, function (err, foundCampground) {
		if (err) {
			console.log(err);
			res. redirect('/campgrounds');
		} else {
			foundCampground.name 		= req.body.name;
			foundCampground.image 		= req.body.image;
			foundCampground.description = req.body.description;
			foundCampground.save();
		}
	});

	//redirect to its show page
	res.redirect('/campgrounds/'+req.params.id);
});

// destroy campground
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err ,campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			// remove is deprecated change it 
			campground.remove();
			res.redirect('/campgrounds');
		}
	})
});

module.exports = router;