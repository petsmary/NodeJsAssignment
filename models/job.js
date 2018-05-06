var mongoose = require('mongoose');
var JobSchema = mongoose.Schema({
                                  position      :   String,
                                  category      :   String,
                                  company       :   String,
                                  description   :   String,
                                  type          :   String,
                                  salary        :   Number,
                                  post_date: { type: Date, default: Date.now },
                                  comments: [{ body: String, date: Date }],
                                  recruitments: [{ employee_id: String, date: Date }]
                                  });
var Job = module.exports = mongoose.model('Job', JobSchema);

module.exports.getAllJobs = function(callback){
	Job.find(callback);
}

module.exports.createJob = function(newJob, callback){
    newJob.save(callback);
}

module.exports.updateJob = function(updateJob, callback){
	Job.findOneAndUpdate({'_id' : ObjectId(updateJob.id) }, updateJob, {upsert: true}, callback);
}

module.exports.deleteJob = function(id, callback){
	Job.deleteOne( { "_id" : ObjectId(id) } );
}

module.exports.addComment = function(job, newComment, callback){
    job.comments.push(newComment);
    job.save(callback);
}

module.exports.addRecruitment = function(job, newRecruitment, callback){
    job.recruitments.push(newRecruitment);
    job.save(callback);
}