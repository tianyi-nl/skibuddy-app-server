const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip.model.js");

// GET "api/trip"
router.get("/", async(req, res, next) => {

try {
    const response = await Trip.find().populate("creator", "name email");
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }

})

// GET one trip by ID

router.get("/:tripId", async (req, res, next) => {
  try {
    const response = await Trip.findById(req.params.tripId).populate(
      "creator",
      "name email"
    );
    if (!response) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});



module.exports = router;