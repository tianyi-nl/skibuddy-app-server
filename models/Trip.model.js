
const { Schema, model } = require("mongoose");

const tripSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "middle", "advanced"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    estimatedBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    hasTransportation: {
      type: Boolean,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;
