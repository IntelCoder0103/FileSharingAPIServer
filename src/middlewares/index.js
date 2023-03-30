const rateLimit = require('express-rate-limit');

const UPLOAD_LIMIT = process.env.UPLOAD_LIMIT || 5;
const DOWNLOAD_LIMIT = process.env.DOWNLOAD_LIMIT || 5;

const limitConfig = {
  windowMs: 24 * 3600 * 1000,
}

const uploadLimiter = rateLimit({
  ...limitConfig,
  maxUploads: UPLOAD_LIMIT,
  keyGenerator: (req) => {
    return req.ip + "-uploads";
  },
  handler: (req, res, next) => {
    res.status(429).json({ error: "Daily upload limit" });
  }
});

const downloadLimiter = rateLimit({
  ...limitConfig,
  maxDownloads: DOWNLOAD_LIMIT,
  keyGenerator: (req) => {
    return req.ip + "-downloads";
  },
  handler: (req, res, next) => {
    res.status(429).json({ error: "Daily download limit" });
  },
});

module.exports = {
  uploadLimiter,
  downloadLimiter
}