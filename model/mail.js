// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var mailSchema = new Schema({
  from: { type: Array, required: true },
  subject : String,
  text: String,
  html: String,
  date: Date
});

// the schema is useless so far
// we need to create a model using it
var Mail = mongoose.model('Mail', mailSchema);

// make this available to our users in our Node applications
module.exports = Mail;