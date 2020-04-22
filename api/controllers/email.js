const mongoose = require('mongoose');
const crypto = require('crypto-js');
const Email = require('../models/email');
const User = require('../models/user');

/**
 * Handles the incoming GET request for the user's emails list
 */
exports.emails_get_emails = async (req, res, next) => {
  const { username } = req.userData;

  try {
    const user = await User.findOne({ username })
      .select('username')
      .populate('emails', 'email password');

    res.status(200).json({
      count: user.emails.length,
      emails: user.emails.map((email) => {
        return {
          email: email.email,
          // decrypting the password of the email
          password: crypto.AES.decrypt(
            email.password,
            process.env.SECRET_KEY
          ).toString(crypto.enc.Utf8),
        };
      }),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Handles the incoming POST request for the creation of a new user email
 */
exports.emails_create_email = async (req, res, next) => {
  const { email, password } = req.body;
  const { username } = req.userData;

  const emailCheck = await Email.findOne({ email });
  // check whether the provided email already exists
  if (emailCheck) {
    return res.status(409).json({
      message: 'Email already exists',
    });
  }

  // encrypting the password of the email
  const hash = crypto.AES.encrypt(password, process.env.SECRET_KEY);

  try {
    const newEmail = new Email({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hash,
    });

    const savedEmail = await newEmail.save();

    const user = await User.findOne({ username });
    const userUpdate = await User.findOneAndUpdate(
      { username },
      {
        emails: user.emails.concat(savedEmail._id),
      }
    );

    res.status(201).json({
      message: 'Email created',
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Handles the incoming PUT request for the update of an user email
 */
exports.emails_update_email = async (req, res, next) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const { username } = req.userData;

  try {
    const user = await User.findOne({ username }).select('username emails');
    const checkId = user.emails.includes(id);
    if (!checkId) {
      return res.status(404).json({
        message: 'Email Not Found',
      });
    }

    const checkEmail = await Email.findOne({ email });

    if (checkEmail && checkEmail._id.toString() !== id) {
      return res.status(409).json({
        message: 'Email already exists',
      });
    }

    const hash = crypto.AES.encrypt(password, process.env.SECRET_KEY);

    const updatedEmail = await Email.findByIdAndUpdate(id, {
      email,
      password: hash.toString(),
    });
    res.status(200).json({
      message: 'Updated Successfully',
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Handles the incoming DELETE request for the deletion of an user email
 */
exports.emails_delete_email = async (req, res, next) => {
  const { id } = req.params;
  const { username } = req.userData;

  try {
    const user = await User.findOne({ username }).select('username emails');
    const checkId = user.emails.includes(id);
    if (!checkId) {
      return res.status(404).json({
        message: 'Email Not Found',
      });
    }

    const deletedEmail = await Email.deleteOne({ _id: id });

    const deleteFromUser = await User.findByIdAndUpdate(user._id, {
      emails: user.emails.filter((email) => email._id.toString() !== id),
    });

    res.status(200).json({
      message: 'Email Deleted',
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Handles the incoming GET request for the user's single email
 */
exports.emails_get_email = async (req, res, next) => {
  const { id } = req.params;
  const { username } = req.userData;

  try {
    const user = await User.findOne({ username }).select('username emails');
    const checkId = user.emails.includes(id);
    if (!checkId) {
      return res.status(404).json({
        message: 'Email Not Found',
      });
    }

    const email = await Email.findById(id);
    res.status(200).json({
      _id: email._id,
      email: email.email,
      password: crypto.AES.decrypt(
        email.password,
        process.env.SECRET_KEY
      ).toString(crypto.enc.Utf8),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
