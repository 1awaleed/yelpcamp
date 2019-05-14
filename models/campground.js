var mongoose 	= require('mongoose');

var Comment 	= require('./comment');

//schema setup
var campgroundSchema = new mongoose.Schema({
	name:  		String,
	price: 		String, 
	image: 		String,
	description:String,
	date: {type: Date, default: Date.now},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comment'
      }
   ],
   author: 	{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:	'User'
		},
		username: String
	}
});

campgroundSchema.pre('remove', async function (next) {
	try {
		await Comment.remove({
			'_id': {
				$in: this.comments
			}
		});
		next();
	} catch(e) {
		// statements
		next(e);
	}
})

var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;