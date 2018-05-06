var express = require('express');
var router = express.Router();

var Job = require('../models/job');

router.get('/', ensureAuthenticated, function(req, res) {
	Job.getAllJobs(function(err, jobs){
		if(err) throw err;
		res.render('index', {username: req.user.username, jobs: jobs});
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