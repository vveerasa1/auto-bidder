const express = require("express");
const router = express.Router();

//Import routes
const userRoutes = require("./user");
const projectRoutes = require("./project");

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);

module.exports = router;
