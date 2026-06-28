// 1. Imports / Requires
const express = require("express");
const path = require("path");
const { connectDb } = require("./config/connect");
const { restrictTo, checkForAuthentication } = require("./middlewares/auth");
require("dotenv").config();

const URL = require("./models/url");

const cookieParser = require("cookie-parser");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/userRoute");

require("dotenv").config();


// 2. App Initialization
const app = express();

// 3. Database Connection
connectDb(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log("Error connecting to database", err);
    process.exit(1);
  });

// 4. App Configuration
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// 5. Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);
// 6. Routes
app.use("/url", restrictTo(["NORMAL USER", "ADMIN"]), urlRoute);
app.use("/", checkForAuthentication, staticRoute);
app.use("/user", userRoute);

app.get("/test", async (req, res) => {
  const allURLS = await URL.find().populate("createdby");

  return res.render("home", {
    urls: allURLS,
  });
});

// 7. Dynamic Routes / Catch-all Routes
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $inc: {
        visitCount: 1,
      },
      $push: {
        visitHistory: {
          timeStamp: Date.now(),
        },
      },
    },
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  return res.redirect(entry.redirectURL);
});

// 8. Start Server
app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`),
);
