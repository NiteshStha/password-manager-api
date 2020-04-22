const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Emails' }]
  },
  { timestamps: true }
);

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
