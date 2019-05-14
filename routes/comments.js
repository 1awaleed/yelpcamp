var express 	= require('express');
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router (campground)
var router		= express.Router({mergeParams: true});

// database model dependencies
var Campground	= require('../models/campground');
var Comment		= require('../models/comment');

// middleware functions
var middleware = require('../middleware');

// NEW - show form to create new COMMENT if user isLoggedIn
router.get('/new', middleware.isLoggedIn, function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err || !campground) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect('back');
		} else {
			res.render('comments/new', {campground: campground});
		}
	});

});

// Create - add new comment to db
router.post('/', middleware.isLoggedIn, function (req, res) {
	//lookup campground using id
	// create new comment
	// connect new comment to campground
	// redirect to campground show page
	Campground.findById(req.params.id, function (err, campground) {
		if (err || !campground) {
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect('back');
		} else {
				Comment.create(req.body.comment, function (err, comment) {
					if (err) {
						console.log(err);
					} else {
						// add username & id to comment
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						// save comment to db
						comment.save();
						// save comment on campground array in db
						campground.comments.push(comment);
						campground.save();
								req.flash('success', 'Comment posted.');
						res.redirect('/campgrounds/'+campground._id);
					}
				});
		}

	});
});

// EDIT - comments route - show form
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err, foundCampground) {
		if (err || !foundCampground) {
			console.log(err);
			req.flash('error', 'Campground not found');
			return res.redirect('back');
		} else {
			Comment.findById(req.params.comment_id, function (err, foundComment) {
				if (err) {
					res.redirect('back');
				} else {
					res.render('comments/edit', {campgroundID: req.params.id, comment:foundComment});

				}
			})
		}
	})	
});

// UPDATE - submit comment edit form route
router.put('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
	Comment.findById(req.params.comment_id, function (err, foundComment) {
		if (err) {
			res.redirect('back');
		} else {
			foundComment.text = req.body.comment.text;
			foundComment.date = new Date();
			foundComment.save();
			res.redirect('/campgrounds/'+req.params.id);
		}
	})
});
// Delete - Destroy comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
	Comment.findOneAndDelete({ _id: req.params.comment_id}, function (err) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted.');
			res.redirect('back');
		}
	})
})

module.exports = router;