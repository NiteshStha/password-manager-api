const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const Emails = mongoose.model('Emails', emailSchema);

module.exports = Emails;
