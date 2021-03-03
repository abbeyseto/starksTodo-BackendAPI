const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    familyName: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    givenName: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    id: {
      type: String,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
      required: [true, "Please enter a valid email"],
      unique: true,
    },
    photoUrl: {
      type: String,
    },
    event: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Event",
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Reverse populate with virtuals
userschema.virtual("events", {
  ref: "Events",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

module.exports = mongoose.model("User", userschema);
