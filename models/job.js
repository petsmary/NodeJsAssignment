var mongoose = require('mongoose');
var jobSchema = mongoose.Schema({
                                  position      :   String,
                                  category      :   String,
                                  company       :   String,
                                  description   :   String,
                                  type          :   String,
                                  salary        :   Number,
                                  post_date: { type: Date, default: Date.now },
                                  comments: [{ body: String, date: Date }]
                                  });
var job = module.exports = mongoose.model('Job', jobSchema);

module.exports.createJob = function(newJob, callback){
    newJob.save(callback);
}