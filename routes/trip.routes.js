const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip.model.js");
const { verifyToken } = require("../middleware/auth.middleware.js");

// GET "api/trip" (/api/join-request/trip/tripId)

router.get("/", async (req, res, next) => {
  try {
    const response = await Trip.find().populate("creator", "name email");
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET one trip by ID

router.get("/:tripId", async (req, res, next) => {
  try {
    const response = await Trip.findById(req.params.tripId).populate(
      "creator",
      "name email",
    );
    if (!response) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//CREATE A TRIP

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const response = await Trip.create({
      title: req.body.title,
      description: req.body.description,
      country: req.body.country,
      location: req.body.location,
      level: req.body.level,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      maxPeople: req.body.maxPeople,
      estimatedBudget: req.body.estimatedBudget,
      hasTransportation: req.body.hasTransportation,
      images: req.body.images,
      creator: req.payload._id,
    });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});


// UPDATE a trip 
router.put("/:tripId", verifyToken, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.creator.toString() !== req.payload._id) { 
      return res.status(403).json({ message: "Not authorized" });
    }

    const response = await Trip.findByIdAndUpdate(
      req.params.tripId,
      {
        title: req.body.title,
        description: req.body.description,
        country: req.body.country,
        location: req.body.location,
        level: req.body.level,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        maxPeople: req.body.maxPeople,
        estimatedBudget: req.body.estimatedBudget,
        hasTransportation: req.body.hasTransportation,
        images: req.body.images,
      },
      { runValidators: true, returnDocument: "after" }
    );
    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
});


//DELETE A TRIP

router.delete("/:tripId", verifyToken, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.creator.toString() !== req.payload._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Trip.findByIdAndDelete(req.params.tripId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
