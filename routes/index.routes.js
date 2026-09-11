const router = require("express").Router();

// ℹ️ Organize and connect all your route files here.
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);


const tripRoutes = require("./trip.routes");
router.use("/trip", tripRoutes);

const joinRequestRoutes = require("./joinRequest.routes");
router.use("/join-request", joinRequestRoutes);


module.exports = router;
