const express = require("express");
const {
  signup,
  login,
  getUser,
  logout,
} = require("../controllers/authController");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", protectRoute, getUser);
router.post("/logout", protectRoute, logout);

module.exports = router;
