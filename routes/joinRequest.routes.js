const express = require("express");
const router = express.Router();
const JoinRequest = require("../models/JoinRequest.model.js");
const Trip = require("../models/Trip.model.js");
const { verifyToken } = require("../middleware/auth.middleware.js");


//GET all join requests for a specific trip(creator only)

router.get("/trip/:tripId", verifyToken, async(req, res, next) => {
    try {
         const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.creator.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const response = await JoinRequest.find({ trip: req.params.tripId }).populate(
      "user",
      "name email"
    );
    res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})


// CREATE a join request

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.body.trip);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.creator.toString() === req.payload._id) {
      return res.status(400).json({ message: "You already created this trip" });
    }

    const response = await JoinRequest.create({
      trip: req.body.trip,
      user: req.payload._id,
      message: req.body.message,
    });
    res.status(201).json(response);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already requested to join this trip" });
    }
    next(error);
  }
});


module.exports = router;

