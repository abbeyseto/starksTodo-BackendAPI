const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const Event = require("../models/Event");
const { query } = require("express");

const googleCalendarApi = require("../utils/googleCalendar");

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

  //Executing query
  const events = await query;

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
  let body = req.body;
  let clientId = body.auth.clientId;
  let refresh_token = body.auth.refreshToken;
  delete body.auth;
  // console.log("1", body);

  const newbody = Object.assign({}, body);

  let eventResponse;

  if (req.body.type === "Event") {
    // console.log("2", body);
    eventResponse = googleCalendarApi(clientId, refresh_token, newbody);
    if (eventResponse) console.log("from create event", eventResponse);
  }

  // console.log("3", newbody);//*PERSONAL NOTE*??
  const event = await Event.create(body);
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
