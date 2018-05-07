var mongoose = require('mongoose');
var JobSchema = mongoose.Schema({
                                  position      :   String,
                                  category      :   String,
                                  company       :   String,
                                  description   :   String,
                                  type          :   String,
                                  salary        :   Number,
                                  post_date: { type: String },
                                  deadline: { type: String },
                                  comments: [{ body: String, date: String }],
                                  recruitments: [{ employee_id: String, date: String }]
                                  });
var Job = module.exports = mongoose.model('Job', JobSchema);

module.exports.getAllJobs = function(callback){
	Job.find(callback);
}

module.exports.createJob = function(newJob, callback){
    newJob.save(callback);
}

module.exports.updateJob = function(id, updateJob, callback){
	Job.findOneAndUpdate({'_id' : id }, updateJob, {upsert: true}, callback);
}

module.exports.deleteJob = function(id, callback){
	Job.deleteOne( { "_id" : id } );
}

module.exports.getJobById = function(id, callback){
	Job.findById(id, callback);
}

module.exports.addComment = function(job, newComment, callback){
    job.comments.push(newComment);
    job.save(callback);
}

module.exports.addRecruitment = function(id, newRecruitment, callback){
    Job.findOneAndUpdate({'_id' : id }, newRecruitment, {upsert: true}, callback);
}