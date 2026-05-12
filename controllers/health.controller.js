exports.healthCheck = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Service is healthy",
  });
};
