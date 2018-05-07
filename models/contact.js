var mongoose = require('mongoose');
var ContactSchema = mongoose.Schema({
                                  username : String,
                                  name      :   String,
                                  email      :   String,
                                  phone       :   String,
                                  subject   :   String,
                                  message          :   String,
                                  feedback        :   [{ body: String, date: String }],
                                  post_date: { type: String }
                                  });
var Contact = module.exports = mongoose.model('Contact', ContactSchema);

module.exports.getUserContacts = function(username, callback){
    var query = {username: username}
	Contact.find(query, callback);
}

module.exports.getAllContacts = function(callback){
	Contact.find(callback);
}

module.exports.createContact = function(newContact, callback){
    newContact.save(callback);
}

module.exports.addFeedback = function(id, newContact, callback){
	Contact.findOneAndUpdate({'_id' : id }, newContact, {upsert: true}, callback);
}