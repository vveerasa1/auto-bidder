const express = require("express");
const router = express.Router();

//Import routes
const authRoutes = require("./auth");
const projectRoutes = require("./project");
const templateRoutes = require("./template")
const AITemplatesRoutes = require("./ai-template")
const UserRoutes = require("./user")

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/templates", templateRoutes);
router.use("/ai/templates",AITemplatesRoutes);
router.use("/users",UserRoutes);

module.exports = router;
