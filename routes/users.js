var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
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
			password: password
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
				console.log(user);
				req.flash('success_msg', 'You are registered and can now login');		
				res.redirect('/users/login');
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

module.exports = router;