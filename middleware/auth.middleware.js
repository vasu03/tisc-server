const ApiKey = require("../models/apikey.model");

const authMiddleware = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];

    if (!key) {
      return res.status(401).json({
        status: "error",
        message: "API key is required",
      });
    }

    const validKey = await ApiKey.findOne({ key, active: true });

    if (!validKey) {
      return res.status(403).json({
        status: "error",
        message: "Invalid or inactive API key",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
