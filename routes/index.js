var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index', { username: req.user.username });
});

router.get('/message', ensureAuthenticated, function(req, res){
	res.render('message', { username: req.user.username });
});

router.get('/contactlg', ensureAuthenticated, function(req, res){
	res.render('contact', { username: req.user.username });
});

router.get('/contact', function(req, res){
	res.render('contact');
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