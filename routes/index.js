const express = require("express");
const router = express.Router();

//Import routes
const userRoutes = require("./user");

router.use("/users", userRoutes);

module.exports = router;
