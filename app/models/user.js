// Schemas

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	
	name: String, // name doesn't have condition
	username: { type: String, required: false, index: { unique: true}}, // username has conditions
	password: { type: String, required: false, select: false} 	        // select = false because we don't want to query passwords

});

// Hash Password Field before we save to DB

UserSchema.pre('save', function(next){			    // 'pre' is Mongoose's middleware method to hash

	var user = this;   								// refers to UserSchema object
 
	if(!user.isModified('password')) return next(); // validation
	// pass in user.password, null, null and a callback function with error and has
	// error handling
	bcrypt.hash(user.password, null, null, function(err, hash) { 
		if(err) return next(err); 
		user.password = hash;  // if there's no error, then hash user password
		next();

	});
});

// create custom method for UserSchema
UserSchema.methods.comparePassword = function(password) {

	var user = this; // refers to UserSchema object

	return bcrypt.compareSync(password, user.password);

}

module.exports = mongoose.model('User', UserSchema);
