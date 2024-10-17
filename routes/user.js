const express = require("express");

const {
  addUser,
  loginUser,
  healthCheck,
  redirect,
  addOauthUser,
} = require("../services/userService");
const router = express.Router();

// POST /users - Create a new user
router.post("/", addUser);

//POST /users/login - Login to bid bot
router.post("/login", loginUser);

//GET /users/health - health check
router.get("/health", healthCheck);

//GET /users/redirect - redirect users to oauth
router.get("/redirect", redirect);

//POST /users/oauth create oauth users from freelancer
router.post("/oauth", addOauthUser);

module.exports = router;
