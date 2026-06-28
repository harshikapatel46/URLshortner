const jwt = require("jsonwebtoken");
const secret = "project4625";

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
  );
}

function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
