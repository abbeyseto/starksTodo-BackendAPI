const express = require("express");
const {
  getEvent,
  getevents,
  createEvent,
  updateevents,
  deleteevents,
} = require("../controllers/events");

// Include other resource routers
// const UserRouter = require("./users");

const router = express.Router();

// Re-route into the other resource router
router.route("/:userId/users").get(getevents);

router.route("/").get(getevents).post(createEvent);

router.route("/:id").get(getEvent).put(updateevents).delete(deleteevents);

module.exports = router;
