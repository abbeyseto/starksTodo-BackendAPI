const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const Event = require("../models/Event");
const { query } = require("express");

//@desc     Get all events
//@route    GET /api/v1/events
//@access   Public
exports.getevents = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete the from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt,$gte, $lt, $lte and $in)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // Finging resources
  query = Event.find(JSON.parse(queryStr)).populate("users");

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Event.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Executing query
  const events = await query;

  // Pagination
  const pagination = {};

  if (endIndex < total) {
    const pageString = `page=${page}`;
    let nextUrl = req.query.page
      ? `${req.hostname}${req.originalUrl.replace(
          pageString,
          `page=${page + 1}`
        )}`
      : `${req.hostname}${req.originalUrl}&page=${page + 1}`;
    pagination.next = {
      page: page + 1,
      limit,
      url: nextUrl,
    };
  }

  if (startIndex > 0) {
    const pageString = `page=${page}`;
    let prevUrl = req.query.page
      ? `${req.hostname}${req.originalUrl.replace(
          pageString,
          `page=${page - 1}`
        )}`
      : `${req.hostname}${req.originalUrl}&page=${page - 1}}`;
    pagination.prev = {
      page: page - 1,
      limit,
      url: prevUrl,
    };
  }

  res.status(200).json({
    sucess: true,
    msg: "Showing all events",
    count: events.length,
    pagination,
    data: events,
  });
});

//@desc     Get a single Event
//@route    GET /api/v1/events/:id
//@access   Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const Event = await Event.findById(req.params.id);
  if (!Event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    sucess: true,
    msg: `Showing a Event ${req.params.id}`,
    data: Event,
  });
});

//@desc     Create new Event
//@route    POST /api/v1/events
//@access   Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  const Event = await Event.create(req.body);
  res.status(201).json({
    sucess: true,
    msg: `Created a Event`,
    data: Event,
  });
});

//@desc     Update a Event
//@route    PUT /api/v1/events/:id
//@access   Private
exports.updateevents = asyncHandler(async (req, res, next) => {
  const Event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!Event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    sucess: true,
    msg: `Updated Event ${req.params.id}`,
    data: Event,
  });
});

//@desc     Delete a Event
//@route    DEL /api/v1/events/:id
//@access   Private
exports.deleteevents = asyncHandler(async (req, res, next) => {
  const Event = await Event.findById(req.params.id);
  if (!Event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  Event.remove();
  res.status(200).json({
    sucess: true,
    msg: `Deleted Event ${req.params.id}`,
    data: {},
  });
});

//@desc     Get events within a radius
//@route    GET /api/v1/events/radius/:zipcode/:distance
//@access   Private
exports.geteventsInRadius = asyncHandler(async (req, res, next) => {
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
