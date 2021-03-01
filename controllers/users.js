const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const { query } = require("express");
const Event = require("../models/Event");

//@desc     Get all users
//@route    GET /api/v1/users
//@route    GET /api/v1/events/:EventId/users
//@access   Public
exports.getusers = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.EventId) {
    query = User.find({ Event: req.params.EventId });
  } else {
    query = User.find().populate({
      path: "Event",
      select: "name description",
    });
  }
  //Copy req.query
  //   const reqQuery = { ...req.query };

  //Fields to exclude
  //   const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete the from reqQuery
  //   removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  //   let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt,$gte, $lt, $lte and $in)
  //   queryStr = queryStr.replace(
  //     /\b(gt|gte|lt|lte|in)\b/g,
  //     (match) => `$${match}`
  //   );
  // Finging resources
  //   query = Event.find(JSON.parse(queryStr));

  // Select fields
  //   if (req.query.select) {
  //     const fields = req.query.select.split(",").join(" ");
  //     query = query.select(fields);
  //   }

  //   //Sort
  //   if (req.query.sort) {
  //     const sortBy = req.query.sort.split(",").join(" ");
  //     query = query.sort(sortBy);
  //   } else {
  //     query = query.sort("-createdAt");
  //   }
  //Pagination
  //   const page = parseInt(req.query.page, 10) || 1;
  //   const limit = parseInt(req.query.limit, 10) || 25;
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   const total = await Event.countDocuments();

  //   query = query.skip(startIndex).limit(limit);

  //Executing query
  const users = await query;

  // Pagination
  //   const pagination = {};

  //   if (endIndex < total) {
  //     const pageString = `page=${page}`;
  //     let nextUrl = req.query.page
  //       ? `${req.hostname}${req.originalUrl.replace(
  //           pageString,
  //           `page=${page + 1}`
  //         )}`
  //       : `${req.hostname}${req.originalUrl}&page=${page + 1}`;
  //     pagination.next = {
  //       page: page + 1,
  //       limit,
  //       url: nextUrl,
  //     };
  //   }

  //   if (startIndex > 0) {
  //     const pageString = `page=${page}`;
  //     let prevUrl = req.query.page
  //       ? `${req.hostname}${req.originalUrl.replace(
  //           pageString,
  //           `page=${page - 1}`
  //         )}`
  //       : `${req.hostname}${req.originalUrl}&page=${page - 1}}`;
  //     pagination.prev = {
  //       page: page - 1,
  //       limit,
  //       url: prevUrl,
  //     };
  //   }

  res.status(200).json({
    sucess: true,
    msg: "Showing all users",
    count: users.length,
    // pagination,
    data: users,
  });
});

//@desc     Get a single User
//@route    GET /api/v1/users/:id
//@access   Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const User = await User.findById(req.params.id).populate({
    path: "Event",
    select: "name description",
  });
  if (!User) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    sucess: true,
    msg: `Showing a Event ${req.params.id}`,
    data: User,
  });
});

//@desc     Add new User
//@route    POST /api/v1/events/:EventId/users
//@access   Private
exports.addUser = asyncHandler(async (req, res, next) => {
  req.body.Event = req.params.EventId;
  console.log(req.body);
  const Event = await Event.findById(req.params.EventId);
  if (!Event) {
    return next(
      new ErrorResponse(`No Event with id of ${req.params.EventId}`, 404)
    );
  }

  const User = await User.create(req.body);
  res.status(201).json({
    sucess: true,
    msg: `Created a User`,
    data: User,
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

//@desc     Get Event within a radius
//@route    GET /api/v1/events/radius/:zipcode/:distance
//@access   Private
exports.getusersInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lbg from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  /**
   * Claculate the raduis using radians
   * divide dist by the radius of the Earth
   * Earth Radius = 3,963mi / 6,378 km
   */
  const raduis = distance / 3963;

  const events = await Event.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], raduis],
      },
    },
  });

  // if (!events) {
  //   return next(
  //     new ErrorResponse(`No events found within this Zipcode and location`, 404)
  //   );
  // }
  res.status(200).json({
    sucess: true,
    count: events.length,
    msg: `Found some eventswithin this Zipcode and location`,
    data: events,
  });
});
