const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const eventschema = new mongoose.Schema({
  summary: {
    type: String,
    trim: true,
    required: [true, "Please add a Event title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  location: {
    type: String,
  },
  type: {
    type: String,
    enum: ["Task", "Event"],
    required: [true, "Please add a type"],
  },
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
  },
  start: {
    type: Object,
    dateTime: {
      type: String,
    },
    timeZone: {
      type: String,
    },
  },
  end: {
    type: Object,
    dateTime: {
      type: String,
    },
    timeZone: {
      type: String,
    },
  },
  attendees: {
    type: Array,
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
  },
  reminders: {
    type: Object,
    useDefault: {
      type: Boolean,
      default: false,
    },
    overrides: {
      type: Array,
      method: {
        type: String,
      },
      minutes: {
        type: String,
      },
    },
  },
  _user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Reverse populate with virtuals
// eventschema.virtual("users", {
//   ref: "User",
//   localField: "_id",
//   foreignField: "event",
//   justOne: false,
// });

module.exports = mongoose.model("Event", eventschema);
