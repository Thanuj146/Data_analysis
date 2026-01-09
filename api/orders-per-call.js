const { getOrdersPerCall } = require("../lib/analytics");

module.exports = (req, res) => {
  const { granularity } = req.query;
  const data = getOrdersPerCall(granularity);

  res.status(200).json(data);
};
module.exports = { getOrdersPerCall };
