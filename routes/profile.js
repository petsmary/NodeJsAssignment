var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res){
	res.render('profile', { username: req.user.username, user: req.user });
});

router.get('/edit', ensureAuthenticated, function(req, res){
	res.render('editProfile', { username: req.user.username, user: req.user});
});

router.get('/experience', ensureAuthenticated, function(req, res){
	res.render('editJobExperience', { username: req.user.username });
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