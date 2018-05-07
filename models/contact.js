var mongoose = require('mongoose');
var ContactSchema = mongoose.Schema({
                                  username : String,
                                  name      :   String,
                                  email      :   String,
                                  phone       :   String,
                                  subject   :   String,
                                  message          :   String,
                                  feedback        :   [{ body: String, date: Date }],
                                  post_date: { type: Date, default: Date.now }
                                  });
var Contact = module.exports = mongoose.model('Contact', ContactSchema);

module.exports.getAllContacts = function(callback){
	Contact.find(callback);
}

module.exports.createContact = function(newContact, callback){
    newContact.save(callback);
}