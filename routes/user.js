const express = require("express");
const { getAllSkillsForUser } = require("../services/userService");

const router = express.Router();

// /users/skills/:userId
router.get("/skills/:userId", getAllSkillsForUser);

module.exports = router