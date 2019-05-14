var mongoose 	= require('mongoose');

var Campground  = require('./models/campground');
var Comment  = require('./models/comment');

var data = [
	{
		name:'Wye Valley Camping',
		image:'https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg',
		description:'Cillum ea nulla consectetur ad sunt nostrud fugiat enim consequat nostrud commodo sed eu duis dolor eu non est deserunt pariatur laborum enim elit laboris dolor velit ut commodo nostrud tempor irure consectetur excepteur ex consectetur deserunt labore esse pariatur quis occaecat ullamco pariatur culpa duis exercitation ut culpa in eiusmod ut amet adipisicing est occaecat incididunt reprehenderit amet officia incididunt et ut adipisicing duis in ut exercitation sit aliquip cillum pariatur labore nisi culpa proident cupidatat aute labore non dolor non pariatur est eu do excepteur ullamco dolor elit officia eu et fugiat irure dolor reprehenderit ullamco deserunt labore nulla dolor exercitation dolor magna et non do minim nostrud dolor esse adipisicing dolor minim velit fugiat officia consectetur ad elit dolore adipisicing laborum magna velit mollit velit sint velit amet reprehenderit aliquip nisi quis eiusmod nostrud occaecat sit cupidatat dolor sint velit excepteur reprehenderit quis sit consectetur consequat in est anim pariatur irure in qui veniam duis reprehenderit officia culpa aliqua tempor qui ad tempor cupidatat adipisicing ullamco dolor elit aliquip dolor.'

	},
	{
		name:'Occoneechee State Park',
		image:'https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg',
		description:'Dolore sit aute sint dolore aute do mollit sint cillum consectetur amet velit aute tempor enim amet sed dolore do velit aliqua minim incididunt eiusmod culpa aute deserunt culpa sunt officia occaecat irure id aute exercitation reprehenderit minim id amet nulla sunt id cupidatat eiusmod aliqua enim sunt velit qui et dolor amet dolore est excepteur reprehenderit aute minim est duis duis dolor id incididunt est officia do labore cupidatat incididunt fugiat magna aliquip in commodo excepteur minim dolor velit quis non veniam occaecat fugiat veniam deserunt pariatur sunt ex cillum deserunt laboris irure magna excepteur sint ex eu exercitation in enim et adipisicing est laboris ex deserunt dolor amet dolore excepteur pariatur enim sunt nulla non adipisicing eiusmod magna pariatur occaecat dolore deserunt ut culpa duis nisi non aute in sint nulla cupidatat officia cupidatat commodo eu consequat anim ad voluptate enim do culpa exercitation ut ullamco labore amet consequat in in ea sint eiusmod ad sed qui nulla ut eiusmod ut deserunt ad est eiusmod cillum duis in sed labore laboris consectetur qui dolor magna aliqua ut esse dolor elit elit laboris est deserunt adipisicing occaecat mollit amet mollit.'

	},
	{
		name:'George Washington Forest',
		image:'https://farm4.staticflickr.com/3361/3576042205_cdaae278ee.jpg',
		description:'Non velit aliquip irure aliquip occaecat consectetur nostrud do nisi ut et enim exercitation duis non duis magna dolor deserunt labore velit et ad et sit tempor dolore reprehenderit magna proident id ut exercitation pariatur voluptate sint magna non ad incididunt occaecat in nisi sint magna tempor mollit consectetur laboris ut veniam amet laboris aliqua anim dolore aliqua tempor cupidatat velit incididunt mollit velit occaecat reprehenderit labore tempor adipisicing do ut ullamco id id officia aliquip ex nostrud exercitation labore sed sint do ut mollit proident exercitation ullamco aute eiusmod velit occaecat officia veniam incididunt ea aliqua duis aliqua sint sit velit dolor velit minim ut nulla qui ad non velit sed sint do nulla proident nisi nostrud dolore magna consectetur et in culpa eu qui nostrud officia proident consequat dolor ad nostrud eu enim sit incididunt aliqua ut ea in nisi fugiat anim dolor anim tempor ullamco eiusmod velit in proident reprehenderit dolore ut non dolore officia eu ad dolore mollit tempor sit reprehenderit irure occaecat ut incididunt nisi do labore ea magna aute dolore id commodo aliqua dolore eu minim cupidatat esse mollit consectetur duis sunt.'

	},
	{
		name:' Kiptopeke State Park',
		image:'https://farm5.staticflickr.com/4423/37232133702_342e447ccb.jpg',
		description:'Aliquip incididunt consectetur magna ut excepteur ex in consectetur do sit ea reprehenderit duis sint nisi elit voluptate labore enim ad consectetur adipisicing cupidatat fugiat ea sed in in dolor pariatur nostrud aute non tempor dolore ea duis sunt ullamco magna ut in in laboris sit ea aute pariatur laborum eu ullamco aliquip aliqua incididunt velit minim in aute reprehenderit ut deserunt veniam amet ex pariatur in do dolor deserunt consectetur consectetur consectetur velit non sed proident sint officia ut dolore anim quis proident in ullamco exercitation elit dolor sunt id sint sunt anim eiusmod in aliquip dolor velit minim dolor in dolor laborum do elit velit consectetur sunt veniam dolor do sit aliquip occaecat irure incididunt adipisicing pariatur ullamco ad exercitation laborum ullamco dolor quis ut ex eu minim exercitation in fugiat nulla culpa aliqua eu ea laboris occaecat commodo minim sed eu occaecat mollit enim laboris sed dolor id sed amet pariatur mollit eiusmod ullamco dolore sit ullamco ad ut adipisicing irure eiusmod anim tempor eu amet in esse incididunt proident veniam aliquip amet id veniam magna et magna fugiat ex in in dolor elit ullamco sunt magna eu pariatur nostrud reprehenderit labore sint exercitation dolore pariatur aliquip anim minim sit ex in culpa eiusmod consectetur amet dolore dolore reprehenderit eu dolore tempor non enim culpa culpa sit tempor officia voluptate laborum ex ut.'

	}
];

function seedDB (argument) {
	// delete all database
	Campground.deleteMany({}, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('removed all campgrounds!');
			Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }else {
            	console.log("removed all comments!");
            	// add some sample data
            	data.forEach(function (seed) {
				Campground.create(seed, function (err, campground) {
					if (err) {
						console.log(err);
					} else {
						console.log('added a campground');
						Comment.create(
						{
							text: 'This place is great but I wish there was internet',
							author: 'Homer'
						},	function (err, comment) {
								if (err) {
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log('created comment');
								}
							}
						);
					}
				});
			});
            }
			
		});
			
		}
	}); 


}

module.exports = seedDB;