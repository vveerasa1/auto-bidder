const express = require("express");
const router = express.Router();

//Import routes
const authRoutes = require("./auth");
const projectRoutes = require("./project");
const templateRoutes = require("./template")
const AITemplatesRoutes = require("./ai-template")

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/templates", templateRoutes);
router.use("/ai/templates",AITemplatesRoutes);

module.exports = router;
