const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const { query } = require("express");
const Event = require("../models/Event");

//@desc     Get all users
//@route    GET /api/v1/users
//@access   Public
exports.getusers = asyncHandler(async (req, res, next) => {
  let query;

  query = User.find();

  //Executing query
  const users = await query;

  res.status(200).json({
    sucess: true,
    msg: "Showing all users",
    count: users.length,
    data: users,
  });
});

//@desc     Get a single User
//@route    GET /api/v1/users/:id
//@access   Public
exports.getUser = asyncHandler(async (req, res, next) => {
  let query = await User.findById(req.params.id).populate("users", {
    path: "event",
    select: "summary description",
  });
  if (!query) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    sucess: true,
    msg: `Showing a user ${req.params.id}`,
    data: query,
  });
});

//@desc     Add new User
//@route    POST /api/v1/users
//@access   Private
exports.addUser = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const google_user_email = req.body.email;
  const checkIfUserExist = await User.find({ email: google_user_email });
  console.log(checkIfUserExist);
  if (checkIfUserExist.length === 0) {
    console.log("Creating new user");
    const user = await User.create(req.body);
    console.log(user);
    return res.status(201).json({
      sucess: true,
      msg: `Created a User`,
      data: user,
    });
  }
  return res.status(200).json({
    sucess: true,
    msg: `User found`,
    data: checkIfUserExist[0],
  });
});

//@desc     Update a User
//@route    PUT /api/v1/users/:id
//@access   Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let User = await User.findById(req.params.id);
  if (!User) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  User = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    sucess: true,
    msg: `Updated User ${req.params.id}`,
    data: User,
  });
});

//@desc     Delete a User
//@route    DEL /api/v1/users/:id
//@access   Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const User = await User.findById(req.params.id);
  if (!User) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  await User.remove();
  res.status(200).json({
    sucess: true,
    msg: `Deleted User ${req.params.id}`,
    data: {},
  });
});
