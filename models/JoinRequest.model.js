
const { Schema, model } = require("mongoose");

const joinRequestSchema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

joinRequestSchema.index({ trip: 1, user: 1 }, { unique: true });

const JoinRequest = model("JoinRequest", joinRequestSchema);

module.exports = JoinRequest;