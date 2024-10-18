const express = require("express");
const router = express.Router();

//Import routes
const authRoutes = require("./auth");
const projectRoutes = require("./project");

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

module.exports = router;
