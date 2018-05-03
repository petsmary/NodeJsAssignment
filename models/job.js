const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jobSchema = mongoose.Schema({
                                  position      :   String,
                                  category      :   String,
                                  company       :   String,
                                  description   :   String,
                                  type          :   String,
                                  salary        :   Number
                                  post_date: { type: Date, default: Date.now }
                                  comments: [{ body: String, date: Date }],
                                  });
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/assignment', { useMongoClient: true });

module.exports = mongoose.model('job', jobSchema);

