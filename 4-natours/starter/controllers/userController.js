const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFiled) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFiled.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Router Handlers
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(500).json({
    status: 'sucess',
    data: {
      users,
    },
  });
};

exports.updateMe = async (req, res, next) => {
  //1. create error if tries to post password data
  if (req.body.passwordConfirm || req.body.password) {
    return next(
      new AppError(
        'This route is not for updating password, please use /updateMyPassword',
        500
      )
    );
  }
  //3. filtered out unwanted filed names that are not allowed to be updated
  const filterBody = filterObj(req.body, 'name', 'email');
  //3. update user document
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    filterBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
};

//Delete Me
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
