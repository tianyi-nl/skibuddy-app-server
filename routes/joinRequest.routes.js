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
    
     // creator only

    if (trip.creator.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const response = await JoinRequest.find({ trip: req.params.tripId }).populate(
      "user",
      "name email profilePicture"
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

// ACCEPT a join request
router.put("/:requestId/accept", verifyToken, async (req, res, next) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.requestId);
    if (!joinRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    const trip = await Trip.findById(joinRequest.trip);
    if (trip.creator.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const acceptedCount = await JoinRequest.countDocuments({
      trip: trip._id,
      status: "accepted",
    });
    const availableSpots = trip.maxPeople - 1 - acceptedCount; // -1 for the creator
    if (availableSpots <= 0) {
      return res.status(400).json({ message: "Trip is full" });
    }

    joinRequest.status = "accepted";
    await joinRequest.save();
    res.status(202).json(joinRequest);
  } catch (error) {
    next(error);
  }
});


//REJECT a join request (trip creator only)

router.put("/:requestId/reject", verifyToken, async (req, res, next) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.requestId);
    if (!joinRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    const trip = await Trip.findById(joinRequest.trip);
    if (trip.creator.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    joinRequest.status = "rejected";
    await joinRequest.save();
    res.status(202).json(joinRequest);
  } catch (error) {
    next(error);
  }
});


// GET the logged-in user's own join request for a specific trip (if any)
router.get("/trip/:tripId/mine", verifyToken, async (req, res, next) => {
  try {
    const joinRequest = await JoinRequest.findOne({
      trip: req.params.tripId,
      user: req.payload._id,
    });
    res.status(200).json(joinRequest); // will be null if none exists
  } catch (error) {
    next(error);
  }
});

// CANCEL (delete) your own pending join request
router.delete("/:requestId", verifyToken, async (req, res, next) => {
  try {
    const joinRequest = await JoinRequest.findById(req.params.requestId);
    if (!joinRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (joinRequest.user.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await JoinRequest.findByIdAndDelete(req.params.requestId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});



module.exports = router;

