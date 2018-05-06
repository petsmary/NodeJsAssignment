var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var path = require("path");
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res){
	res.render('profile', { username: req.user.username});
});

router.get('/cv', ensureAuthenticated, function(req, res){
	var dir = './uploads/' + req.user._id;
	var files = [];

	fs.readdirSync(dir).forEach(file => {
		files.push(file)
		//console.log(file);
	})
	res.render('cv', { username: req.user.username, files:files});
});

router.get('/edit', ensureAuthenticated, function(req, res){
	res.render('editProfile', { username: req.user.username});
});

router.get('/experience', ensureAuthenticated, function(req, res){
	res.render('editJobExperience', { username: req.user.username });
});

router.post('/cv/upload', ensureAuthenticated, function(req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		var filename = fields.filename;
		var oldpath = files.filetoupload.path;
		var newpath =  path.join(__dirname, '../') + "uploads/" + req.user._id;
		if (!fs.existsSync(newpath)){
			fs.mkdirSync(newpath);
		}
		newpath += "/" + filename;
		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
			req.flash('success_msg', 'Your CV is uploaded');		
			res.redirect('/profile/cv');
		});
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