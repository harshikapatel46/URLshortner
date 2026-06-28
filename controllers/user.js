const user = require("../models/user");
const { setUser } = require("../service/auth");
const bcrypt = require("bcrypt");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(409).render("signup", {
      error: "An account already exists with this email. Please login.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await user.create({
    name,
    email,
    password: hashedPassword,
  });

  return res.render("login", {
    message: "Account created successfully. Please login.",
  });
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const userData = await user.findOne({ email });

  if (!userData) {
    return res.status(401).render("login", { error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    return res.status(401).render("login", { error: "Invalid credentials" });
  }

  const token = setUser(userData);
  res.cookie("token", token);

  return res.redirect("/home");
}

function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/login");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};
