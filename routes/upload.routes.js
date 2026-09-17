const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

router.post("/", upload.single("image"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    next(error);
  }
});

module.exports = router;