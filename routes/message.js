var express = require('express');
var router = express.Router();

var Contact = require('../models/contact');

router.get('/', ensureAuthenticated, function(req, res) {
	Contact.getUserContacts(req.user.username, function(err, contacts){
		if(err) throw err;
		res.render('message', {username: req.user.username, contacts: contacts});
	});
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