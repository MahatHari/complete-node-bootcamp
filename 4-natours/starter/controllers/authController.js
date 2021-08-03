const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...req.body,
  };
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  try {
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
