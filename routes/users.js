var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var path = require("path");
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

router.get('/', ensureAuthenticated, function(req, res) {
	if(req.user.userType == 'admin') {
		User.getAllUsers(function(err, users){
			if(err) throw err;
			res.render('user', {username: req.user.username, users: users});
		});
		
	} else {
		res.redirect('/profile/');
	}
});

router.get('/userInfo/:userInfo', ensureAuthenticated, function(req, res) {
	if(req.user.userType == 'admin') {
		var userInfo = req.params.userInfo;
		console.log(userInfo)
		User.getUserByUsername(userInfo, function(err, users){
			if(err) throw err;
			res.render('viewProfile', {userInfo: users});
		});
		
	} else {
		res.redirect('/profile/');
	}
});

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Add User
router.get('/addUser', ensureAuthenticated, function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	User.getUserByUsername("admin", function(err, user){
		if(err) throw err;
		var epath =  path.join(__dirname, '../') + "uploads";
			if (!fs.existsSync(epath)){
				fs.mkdirSync(epath);
			}
		if(!user){
			var newAdmin = new User({
				name: "admin",
				email: "admin@recruiteapp.com",			
				gender: null,
				address: null,
				phone: null,
				dob: null,
				username: "admin",
				password: "admin",
				userType: "admin"
			});
	
			User.createUser(newAdmin, function(err, user){
				if(err) throw err;
			});
		}
	});
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var userType = req.body.userType;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,			
			gender: null,
			address: null,
			phone: null,
			dob: null,
			username: username,
			password: password,
			userType: userType
		});

		User.createUser(newUser, function(err, user){
			if(err) {
				console.log(err);
				if (err.code === 11000) {
					// Duplicate username
					req.flash('error_msg', 'User already exist!');
					res.redirect('/users/register');
				}				
			} else {
				var epath =  path.join(__dirname, '../') + "uploads/" + user._id;
				fs.mkdirSync(epath);
				console.log(user);
				req.flash('success_msg', 'You are registered and can now login');		
				res.redirect('/users/login');
			}
		});
		
	}
});

// Register User
router.post('/add', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,			
			gender: null,
			address: null,
			phone: null,
			dob: null,
			username: username,
			password: password,
			userType: userType
		});

		User.createUser(newUser, function(err, user){
			if(err) {
				console.log(err);
				if (err.code === 11000) {
					// Duplicate username
					req.flash('error_msg', 'User already exist!');
					res.redirect('/users/register');
				}				
			} else {
				var epath =  path.join(__dirname, '../') + "uploads/" + user._id;
				fs.mkdirSync(epath);
				console.log(user);
				req.flash('success_msg', 'You are registered and can now login');		
				res.redirect('/users/');
			}
		});
		
	}
});

// Update User
router.post('/update', function(req, res){
	var phone = req.body.phone;
	var address = req.body.address;
	var dob = req.body.dob;
	var gender = req.body.gender;
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var newpassword = req.body.newpassword;
	var newpassword2 = req.body.newpassword2;
	var xx = req.body.xx;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('newpassword2', 'New Passwords do not match').equals(req.body.newpassword);
	
	User.comparePassword(password, xx, function(err, isMatch){
		if(err) throw err;
		if(isMatch){
			if (newpassword !== "") {
				password = newpassword;
			}
		
			var errors = req.validationErrors();
		
			if(errors){
				res.render('editProfile',{
					errors:errors
				});
			} else {
				var updateUser = {
					name: name,
					email: email,
					gender: gender,
					address: address,
					phone: phone,
					dob: dob,
					username: username,
					password: password
				};
		
				User.updateUser(updateUser, function(err, user){
					if(err) {
						console.log(err);					
					} else {
						console.log(user);
						req.flash('success_msg', 'Your profile is updated');		
						res.redirect('/profile/');
					}
				});
				
			}
		} else {
			req.flash('error_msg', 'Invalid password');		
			res.redirect('/profile/edit');
		}
	});
});

// Admin Delete User
router.post('/admin/delete', function(req, res){
	var username = req.body.username;
	User.deleteUser(username, function(err, user){
		if(err) {
			console.log(err);	
			req.flash('error_msg', err);		
			res.redirect('/users/');				
		} else {
			console.log(user);
			var dirPath =  path.join(__dirname, '../') + "uploads/" + user._id;
			rmDir(dirPath);
			req.flash('success_msg', 'The user is deleted');		
			res.redirect('/users/');
		}
	});
});

rmDir = function (dirPath) {
	try { var files = fs.readdirSync(dirPath); }
	catch(e) { return; }
	if (files.length > 0)
	  for (var i = 0; i < files.length; i++) {
		var filePath = dirPath + '/' + files[i];
		if (fs.statSync(filePath).isFile())
		  fs.unlinkSync(filePath);
		else
		  rmDir(filePath);
	  }
	fs.rmdirSync(dirPath);
}

// Admin Update User
router.post('/admin/update', function(req, res){
	var phone = req.body.phone;
	var address = req.body.address;
	var dob = req.body.dob;
	var gender = req.body.gender;
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var xx = req.body.xx; 

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	
	var errors = req.validationErrors();
		
	if(errors){
		res.render('user',{
			error:errors
		});
	}

	var updateUser = {
			name: name,
			email: email,
			gender: gender,
			address: address,
			phone: phone,
			dob: dob,
			username: username,
			password: password
		};
	
		if (password === xx) {
		

		User.updateUser2(updateUser, function(err, user){
			if(err) {
				console.log(err);	
				req.flash('error_msg', err);		
				res.redirect('/users/');				
			} else {
				console.log(user);
				req.flash('success_msg', 'The user is updated');		
				res.redirect('/users/');
			}
		});
	} else {
		User.updateUser(updateUser, function(err, user){
			if(err) {
				console.log(err);	
				req.flash('error_msg', err);		
				res.redirect('/users/');				
			} else {
				console.log(user);
				req.flash('success_msg', 'The user is updated');		
				res.redirect('/users/');
			}
		});
	}
		
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			var epath =  path.join(__dirname, '../') + "uploads/" + user._id;
			if (!fs.existsSync(epath)){
				fs.mkdirSync(epath);
			}
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;