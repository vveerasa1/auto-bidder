const express = require("express");

const { getAllProjects } = require("../services/projectService");

const router = express.Router();

//GET -projects/:freelancerId get all active projects
router.get("/:freelancerId", getAllProjects);

module.exports = router;
