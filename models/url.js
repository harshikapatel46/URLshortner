const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
    visitHistory: [
      {
        timeStamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const URL = mongoose.model("URL", urlSchema);
module.exports = URL;
