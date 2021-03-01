const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const eventschema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a User title"],
  },
  //   slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please addd a tuition cost"],
  },
  minimumSkill: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: [true, "Please addd a minimum skill"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  Event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Reverse populate with virtuals
eventschema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "Event",
  justOne: false,
});
module.exports = mongoose.model("Event", eventschema);
