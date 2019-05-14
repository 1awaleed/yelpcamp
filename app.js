var express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	methodOverride	= require('method-override'),
	flash			= require('connect-flash');

// authentication
var passport 		= require('passport'),
	LocalStrategy	= require('passport-local'),
	expressSession 	= require('express-session');

// dataBase Models
var Campground  = require('./models/campground'),
	Comment 	= require('./models/comment'),
	User		= require('./models/user'),
	seedDB		= require('./seeds');

// routes
var commentRoutes		= require('./routes/comments'),
	campgroundRoutes	= require('./routes/campgrounds'),
	index				= require('./routes/index');

// locally
// process.env.DATABASEURL = mongodb://localhost:27017/yelp_camp
// this is set using terminal's command: exprot DATABASEURL=mongodb://blabla
// deployed
// mongodb+srv://skate:password12345@cluster0-pbdio.mongodb.net/test?retryWrites=true
// if process.env.DATABASEURL is  not available, we should have a default variable.
var dbUrl = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

mongoose.connect(dbUrl, { useNewUrlParser: true});
console.log(`Database connected on: ${dbUrl}`)


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));		//to use PUT requests to update data
app.use(flash());

// seed dataBase
// seedDB();

// passport CONFIG
app.use(expressSession({
	secret: "this string is used to compute the hash function it can be anything blabla",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware that will run for all routes
// send currentUser to all ejs templates instead of sending it in each render call
// anything added to res.locals is available to all templates
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error     = req.flash('error');
	res.locals.success   = req.flash('success');
	next();
});

// adding '/campgrounds' before using campgroundRoutes will append 
// '/campgrounds' to the beggining of urls in the campgroundRoutes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(index);


// app.listen(3000, function () {
// 	console.log('Serving YelpCamp on localhost:3000');
// });
// for heroku
// app.listen(process.env.PORT, process.env.IP);

// work for both cases
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Servering is listening on PORT: ${PORT}`);
});