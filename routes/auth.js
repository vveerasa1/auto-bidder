const express = require("express");

const {
  loginUser,
  healthCheck,
  redirect,
  addOauthUser,
} = require("../services/authService");
const router = express.Router();

//POST /auth/login - Login to bid bot
router.post("/login", loginUser);

//GET /auth/health - health check
router.get("/health", healthCheck);

//GET /auth/redirect - redirect auth to freelancer oauth page
router.post("/redirect", redirect);

//POST /auth/oauth create oauth auth from freelancer
router.post("/oauth", addOauthUser);

module.exports = router;
