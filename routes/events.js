const express = require("express");
const {
  getEvent,
  getevents,
  createEvent,
  updateevents,
  deleteevents,
  geteventsInRadius,
} = require("../controllers/events");

// Include other resource routers
const UserRouter = require("./users");

const router = express.Router();

// Re-route into the other resource router
router.use("/:EventId/users", UserRouter);

router.route("/").get(getevents).post(createEvent);

router.route("/:id").get(getEvent).put(updateevents).delete(deleteevents);

router.route("/radius/:zipcode/:distance").get(geteventsInRadius);

module.exports = router;
