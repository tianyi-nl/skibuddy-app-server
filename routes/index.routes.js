const router = require("express").Router();

// ℹ️ Organize and connect all your route files here.
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

module.exports = router ;