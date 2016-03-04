// Call all important packages

var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
// When a user logs in they get a Token
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresInMinute: 1440
	});
	
	return token;

}

module.exports = function(app, express) {
	// call express function
	var api = express.Router();

	// first API is signup
	api.post('/signup', function(req, res){

			// create a new user
			var user = new User({

				// pull in data from user.js
				name: req.body.name,
				
				// body parser
				username: req.body.username,
				password: req.body.password
			});

			// add callback function 
			user.save(function(err){
				if(err){

					// error handling
					res.send(err);
					return;

				}
				res.json({message: 'User has been created!'});
			});
	});

	// Check if user already exists and handle that
	api.get('/users', function(req, res) {

		// Mongoose find method which finds every user
		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);

		});
	});
	
	// Create a login
	api.post('/login', function(req, res) {

		User.findOne({
			username: req.body.username

		}).select('password').exec(function(err, user) {
			if(err) throw err;

			if(!user) {
				res.send({ message: "User doesn't exist!"});
			} else if(user){
				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid password"});
				} else {

					// Token 
					var token = createToken(user);

					res.json({
						sucess: true,
						message: "Successfuly login!",
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next) {

		console.log("We have a visitor");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		
		// Check if token exists
		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {
			
				if(err) {
					res.status(403).send({ success: false, message:"Failed to authenticate"});
			
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {

			res.status(403).send({ success: false, message: "No Token Provided!"});
		}
	});

	// Provide a Legitimate Token

	// Create a Home API

	api.route('/')

		.post(function(req, res) { 

			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content,


			});

			story.save(function(err) {
				if(err) {
					res.send(err);
					return
				}

				res.json({message: "New Story Created!"});
			});
		})

		.get(function(req, res) {

			Story.find({ creator: req.decoded.id }, function(err, stories) {

				if(err) {
					res.send(err);
					return;

				}
				res.json(stories);
			});
		});

	api.get('/me', function(req, rest) {
		res.json(req.decoded);

	});

	return api 

}