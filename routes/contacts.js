var express = require('express');
var router = express.Router();

var Contact = require('../models/contact');

router.get('/', ensureAuthenticated, function(req, res) {
	Contact.getAllContacts(function(err, contacts){
		if(err) throw err;
		res.render('listContact', {username: req.user.username, contacts: contacts});
	});
});

// Add Contact
router.post('/add', function(req, res){
    var name = req.body.name;
	var email = req.body.email;
	//var username = req.user.username;
	var phone = req.body.phone;
    var subject = req.body.subject;
    var message = req.body.message;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('phone', 'Phone is required').notEmpty();
    req.checkBody('subject', 'Subject is required').notEmpty();
	req.checkBody('message', 'Message is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
        res.render('contact',{
			error:errors
		});
	} else {
       var newContact = new Contact({
			name: name,
			email: email,			
			phone: phone,
			subject: subject,
			message: message,
			post_date: new Date().toUTCString()
		});

		Contact.createContact(newContact, function(err, contact){
			if(err) {
				console.log(err);
							
			} else {
				console.log(contact);
				req.flash('success_msg', 'Your message is sent');		
				res.redirect('/contact_us');
			}
		});
		
	}
});

// Add Contact
router.post('/addlg', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.user.username;
	var phone = req.body.phone;
    var subject = req.body.subject;
    var message = req.body.message;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('phone', 'Phone is required').notEmpty();
    req.checkBody('subject', 'Subject is required').notEmpty();
	req.checkBody('message', 'Message is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('contact',{
			error:errors,  username: req.user.username 
		});
	} else {
		var newContact = new Contact({
			name: name,
			email: email,			
			phone: phone,
			subject: subject,
			message: message,
            post_date: new Date().toUTCString(),
            username : username
		});

		Contact.createContact(newContact, function(err, contact){
			if(err) {
				console.log(err);
							
			} else {
				console.log(contact);
				req.flash('success_msg', 'Your message is sent');		
				res.redirect('/contact_us_lg');
			}
		});
		
	}
});

// Add Feedback
router.post('/feedback', function(req, res){
	var feedback = req.body.feedback;
	var _id = req.body._id;

	// Validation
	req.checkBody('feedback', 'Message is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('contacts',{
			error:errors,  username: req.user.username 
		});
	} else {
		var newContact = ({
			feedback: {
                body :feedback, 
                date: new Date().toUTCString()
            }
		});

		Contact.addFeedback(_id, newContact, function(err, contact){
			if(err) {
				console.log(err);
							
			} else {
				console.log(contact);
				req.flash('success_msg', 'Your feedback is sent');		
				res.redirect('/contacts');
			}
		});
		
	}
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