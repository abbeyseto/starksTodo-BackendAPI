const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const Event = require("../models/Event");
const { query } = require("express");

//@desc     Get all events
//@route    GET /api/v1/events
//@route    GET /api/v1/events/:userId/users
//@access   Public
exports.getevents = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.userId) {
    console.log(req.params.userId);
    query = Event.find({ _user: req.params.userId });
  } else {
    query = Event.find();
  }
  //Copy req.query
  // const reqQuery = { ...req.query };

  // //Fields to exclude
  // const removeFields = ["select", "sort", "page", "limit"];

  // //Loop over removeFields and delete the from reqQuery
  // removeFields.forEach((param) => delete reqQuery[param]);

  // //Create query string
  // let queryStr = JSON.stringify(reqQuery);

  // // Create operators ($gt,$gte, $lt, $lte and $in)
  // queryStr = queryStr.replace(
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}`
  // );
  // // Finging resources
  // query = Event.find(JSON.parse(queryStr));

  // // Select fields
  // if (req.query.select) {
  //   const fields = req.query.select.split(",").join(" ");
  //   query = query.select(fields);
  // }

  // //Sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }
  // //Pagination
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 25;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const total = await Event.countDocuments();

  // query = query.skip(startIndex).limit(limit);

  //Executing query
  const events = await query;

  // Pagination
  // const pagination = {};

  // if (endIndex < total) {
  //   const pageString = `page=${page}`;
  //   let nextUrl = req.query.page
  //     ? `${req.hostname}${req.originalUrl.replace(
  //         pageString,
  //         `page=${page + 1}`
  //       )}`
  //     : `${req.hostname}${req.originalUrl}&page=${page + 1}`;
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //     url: nextUrl,
  //   };
  // }

  // if (startIndex > 0) {
  //   const pageString = `page=${page}`;
  //   let prevUrl = req.query.page
  //     ? `${req.hostname}${req.originalUrl.replace(
  //         pageString,
  //         `page=${page - 1}`
  //       )}`
  //     : `${req.hostname}${req.originalUrl}&page=${page - 1}`;
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //     url: prevUrl,
  //   };
  // }

  res.status(200).json({
    sucess: true,
    msg: "Showing all events",
    count: events.length,
    // pagination,
    data: events,
  });
});

//@desc     Get a single Event
//@route    GET /api/v1/events/:id
//@access   Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    sucess: true,
    msg: `Showing a Event ${req.params.id}`,
    data: event,
  });
});

//@desc     Create new Event
//@route    POST /api/v1/events
//@access   Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(201).json({
    sucess: true,
    msg: `Created a Event`,
    data: event,
  });
});

//@desc     Update a Event
//@route    PUT /api/v1/events/:id
//@access   Private
exports.updateevents = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    sucess: true,
    msg: `Updated Event ${req.params.id}`,
    data: event,
  });
});

//@desc     Delete a Event
//@route    DEL /api/v1/events/:id
//@access   Private
exports.deleteevents = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  event.remove();
  res.status(200).json({
    sucess: true,
    msg: `Deleted Event ${req.params.id}`,
    data: {},
  });
});
