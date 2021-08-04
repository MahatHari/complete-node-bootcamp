const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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
  const token = signToken(newUser._id);
  try {
    res.status(201).json({
      status: 'success',
      token,
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //1. Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError(`Please provide email and password`, 400)
    );
  }
  //2 . Check if user exists && password is correct
  const user = await User.findOne({ email }).select(
    '+password'
  );
  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(
      new AppError('Incorrect email or password', 401)
    );
  }

  //3 If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
};

//Middleware functions
//1. Protected Routes
exports.protect = async (req, res, next) => {
  //1. Getting token and check if its there((
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError(
        'You are not logged in. Please login',
        401
      )
    );
  }
  //2. Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new Error('User no longer exist ', 401));
  }
  // 4. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! please log in again',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};

//Authorization, GRANT ACCESS TO PROTECT ROUTE
// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403
        )
      );
    }

    next();
  };
};

//Fogot password
exports.forgotPassword = catchAsync(
  async (req, res, next) => {
    //1. Get user based on posted email
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return next(
        new AppError(
          'There is no user with given email address',
          404
        )
      );
    }

    //2. Generete a random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3. Send it to user's email
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password ? Sumbit a patch request eith your new password and confirm password to :${resetUrl} \n If you did not forget your password please ignore this`;

    try {
      await sendEmail({
        email: user.email,
        subject:
          'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(err);
      return next(
        new AppError(
          ' something went wrong, Try again later',
          500
        )
      );
    }
  }
);
exports.resetPassword = async (req, res, next) => {
  //1. Get User based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2.  If token has not expired and there is user set new password
  if (!user) {
    return next(
      new AppError('Token is invalid or has expired', 400)
    );
  }
  //3.  update changePassword at property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //4. log the user in send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'sucess',
    token,
  });
};
