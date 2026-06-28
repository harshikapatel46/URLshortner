const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  const allURLs = await URL.find({})
    .populate("createdby", "name email")
    .sort({ createdAt: -1 });
  res.render("home", {
    urls: allURLs,
    user: req.user,
  });
});

router.get("/", (req, res) => {
  return res.render("login");
});

router.get("/home", restrictTo(["NORMAL USER", "ADMIN"]), async (req, res) => {
  let allURLs;

  if (req.user.role === "ADMIN") {
    // Admins see all URLs sorted by most recent
    allURLs = await URL.find({})
      .populate("createdby", "name email")
      .sort({ createdAt: -1 });
  } else {
    // Normal users see only their URLs
    allURLs = await URL.find({ createdby: req.user._id });
  }

  res.render("home", {
    urls: allURLs,
    user: req.user,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
