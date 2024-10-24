const express = require("express");

const { getAllProjects, placeBid } = require("../services/projectService");

const router = express.Router();

//GET -projects/:freelancerId get all active projects
router.get("/:freelancerId", getAllProjects);

//POST - projects/placebids place bid for the project
router.post("/bids", placeBid);

module.exports = router;
