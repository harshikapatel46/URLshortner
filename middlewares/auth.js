const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;

  req.user = null;

  if (!tokenCookie) {
    return next();
  }
  const token = tokenCookie;
  const user = getUser(token);
  req.user = user;
  next();
}

function restrictTo(roles) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .send("You are not authorized to access this resource");
    }

    next();
  };
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};
