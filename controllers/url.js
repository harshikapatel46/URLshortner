const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const shortID = nanoid(8);

    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
      createdby: req.user._id,
    });

    const allURLs = await URL.find({
      createdby: req.user._id,
    });

    return res.render("home", {
      id: shortID,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortID}`,
      urls: allURLs,
      user: req.user || null ,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create short URL",
    });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
