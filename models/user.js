var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		unique:true
	},
	password: {
		type: String
	},
	gender: {
		type: String,
		default: null
	},
	address: {
		type: String,
		default: null
	},
	phone: {
		type: String,
		default: null
	},
	dob: {
		type: String,
		default: null
	},
	email: {
		type: String,
		unique:true
	},
	name: {
		type: String
	},
	userType: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAllUsers = function(callback){
	User.find(callback);
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.updateUser = function(updateUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(updateUser.password, salt, function(err, hash) {
			updateUser.password = hash;
			User.findOneAndUpdate({'username' : updateUser.username}, updateUser, {upsert: true}, callback);
		});
	});
}

module.exports.updateUser2 = function(updateUser, callback){
			User.findOneAndUpdate({'username' : updateUser.username}, updateUser, {upsert: true}, callback);
		
}

module.exports.deleteUser = function(username, callback){
	User.findOneAndRemove({'username' : username}, callback);

}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}