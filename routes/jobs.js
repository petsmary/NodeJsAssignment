var express = require('express');
var router = express.Router();

var Job = require('../models/job');

router.get('/', ensureAuthenticated, function(req, res) {
	Job.getAllJobs(function(err, jobs){
		if(err) throw err;
		res.render('index', {username: req.user.username, jobs: jobs});
	});
});

router.get('/addForm', ensureAuthenticated, function(req, res) {
	if(req.user.userType == 'admin') {
		res.render('addJobForm', {username: req.user.username});
	}
});

// Add Job
router.post('/add', function(req, res){
	var position = req.body.position;
	var category = req.body.category;
	var company = req.body.company;
	var description = req.body.description;
	var type = req.body.type;
	var salary = req.body.salary;
	var deadline = req.body.deadline;

	// Validation
	req.checkBody('company', 'company is required').notEmpty();
	req.checkBody('category', 'category is required').notEmpty();
	req.checkBody('position', 'position is required').notEmpty();
	req.checkBody('type', 'type is required').notEmpty();
	req.checkBody('salary', 'salary is required').notEmpty();
	req.checkBody('deadline', 'deadline is required').notEmpty();
	req.checkBody('salary', 'salary must be number').isNumeric();

	var errors = req.validationErrors();

	if(errors){
		res.render('addJobForm',{
			error:errors,
			username: req.user.username
		});
	} else {
		var newJob = new Job({
			position: position,
			category: category,			
			company: company,
			description: description,
			type: type,
			salary: salary,
			deadline: deadline,
			post_date: new Date().toUTCString()
		});

		Job.createJob(newJob, function(err, user){
			if(err) {
				console.log(err);
							
			} else {
				console.log(user);
				req.flash('success_msg', 'Job is added');		
				res.redirect('/jobs');
			}
		});
		
	}
});

// Update Job
router.post('/update', function(req, res){
	var position = req.body.position;
	var category = req.body.category;
	var company = req.body.company;
	var description = req.body.description;
	var type = req.body.type;
	var salary = req.body.salary;
	var deadline = req.body.deadline;
	var id = req.body._id;

	// Validation
	req.checkBody('company', 'company is required').notEmpty();
	req.checkBody('category', 'category is required').notEmpty();
	req.checkBody('position', 'position is required').notEmpty();
	req.checkBody('type', 'type is required').notEmpty();
	req.checkBody('salary', 'salary is required').notEmpty();
	req.checkBody('deadline', 'deadline is required').notEmpty();
	req.checkBody('salary', 'salary must be number').isNumeric();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			error:errors,
			username: req.user.username
		});
	} else {
		var newJob = ({
			position: position,
			category: category,			
			company: company,
			description: description,
			type: type,
			salary: salary,
			deadline: deadline,
		});

		Job.updateJob(id, newJob, function(err, user){
			if(err) {
				console.log(err);
							
			} else {
				console.log(user);
				req.flash('success_msg', 'Job is updated');		
				res.redirect('/jobs');
			}
		});
		
	}
});

// Apply Job
router.post('/apply', function(req, res){
	var id = req.body._id;

	var recruitments = {
		
		employee_id :req.user._id, 
		date: new Date().toUTCString()
	
	};

	Job.getJobById(id, function(err, job){
		if(err) {
			console.log(err);
						
		} else {
			
			try {
				job.recruitments.forEach(function(element) {
					if(req.user._id == element.employee_id) throw BreakException;
				});

			job.recruitments.push(recruitments);
			Job.addRecruitment(id, job, function(err, user){
				if(err) {
					console.log(err);
								
				} else {
					console.log(user);
					req.flash('success_msg', 'Job is applied');		
					res.redirect('/jobs');
				}
			});
			}
			catch (e) {
				req.flash('error_msg', 'You have applied the Job ');		
				res.redirect('/jobs');
			}
			
		}
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