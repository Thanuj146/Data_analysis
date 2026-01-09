const { getSessionsOrdersConversion } = require("../lib/analytics");

module.exports = (req, res) => {
  const { granularity } = req.query;
  const data = getSessionsOrdersConversion(granularity);

  res.status(200).json(data);
};
module.exports = { getSessionsOrdersConversion };
