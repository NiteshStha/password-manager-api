const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/**
 * Handles the incoming POST request for the users sign up / create a user
 */
exports.users_signup = async (req, res, next) => {
  const { firstname, lastname, username, password } = req.body;
  const users = await User.find({ username });
  // check whether the provided username already exists
  if (users.length >= 1) {
    return res.status(409).json({
      message: 'Username already exists'
    });
  }
  // returns a hashed value for the provided password
  const hash = await bcrypt.hash(password, 8);

  try {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstname,
      lastname,
      username,
      password: hash
    });
    const savedUser = await user.save();
    res.status(201).json({
      message: 'User created'
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

/**
 * Handles the incoming POST request for the users login
 */
exports.users_login = async (req, res, next) => {
  const { username, password } = req.body;
  const users = await User.find({ username });
  // check whether the username is valid
  if (users.length < 1) {
    return res.status(401).json({
      message: 'Authentication Failed'
    });
  }
  try {
    // returns true if the comparison between password provided by the user and the hash matches
    const compare = await bcrypt.compare(password, users[0].password);

    // if the comparison between the password provided by the user and the hash value does not match
    if (!compare) {
      return res.status(401).json({
        message: 'Authentication failed'
      });
    }
    // if the comparison between the password provided by the user and the hash value matches
    const token = jwt.sign(
      {
        username,
        password
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h'
      }
    );
    return res.status(200).json({
      message: 'Auth successful',
      token
    });
  } catch (err) {
    res.status(500).json({
      error: 'All input fields must be valid'
    });
  }
};

/**
 * Handles the incoming DELETE request for the user
 */
exports.users_delete_user = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const users = await User.find({ _id });
    // check whether the user id is valid
    if (users.length < 1) {
      return res.status(401).json({
        message: 'Invalid Id'
      });
    }
    const deleteResult = await User.findByIdAndDelete({ _id });
    res.status(200).json({
      message: 'User Deleted'
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
