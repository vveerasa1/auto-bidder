const express = require("express");

const { addUser, loginUser, healthCheck } = require("../services/userService");
const router = express.Router();

// POST /users - Create a new user
router.post("/", addUser);

//POST /users/login - Login to bid bot
router.post("/login", loginUser);

//GET /users/health - health check
router.get("/health", healthCheck);

module.exports = router;
