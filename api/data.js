const { getAggregatedData } = require("../lib/analytics");

module.exports = (req, res) => {
  const { view, granularity } = req.query;
  const data = getAggregatedData(view, granularity);

  res.status(200).json(data);
};
module.exports = { getAggregatedData };
