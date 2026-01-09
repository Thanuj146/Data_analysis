const XLSX = require("xlsx");

/**************** LOAD DATA ****************/
const workbook = XLSX.readFile("Data Analytics Intern Assignment - Data Set.xlsx");

const ordersData = XLSX.utils.sheet_to_json(workbook.Sheets["Orders_Raw"]);
const sessionsData = XLSX.utils.sheet_to_json(workbook.Sheets["Sessions_Raw"]);
const callsData = XLSX.utils.sheet_to_json(workbook.Sheets["Calls_Raw"]);

/**************** HELPERS ****************/
function normalizePhone(phone) {
  if (!phone) return null;
  return phone.toString().replace(/\D/g, "").slice(-10);
}

function parseExcelDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date((value - 25569) * 86400 * 1000);
  return new Date(value);
}

function getTimeBucket(value, granularity) {
  const date = parseExcelDate(value);
  if (!date || isNaN(date)) return null;

  if (granularity === "Daily") return date.toISOString().split("T")[0];

  if (granularity === "Weekly") {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstDay) / 86400000);
    const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  if (granularity === "Monthly") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }
}

/**************** DATASET PICKER ****************/
function getDataset(view) {
  if (view === "Orders") return ordersData;
  if (view === "Sessions") return sessionsData;
  if (view === "Calls") return callsData;
}

/**************** TASK 1 ****************/
function getAggregatedData(view, granularity) {
  const data = getDataset(view);
  const map = {};

  data.forEach(row => {
    let entity, date;

    if (view === "Orders") {
      entity = normalizePhone(row["Phone"]);
      date = row["Order Date"];
    }

    if (view === "Sessions") {
      entity = row["Device ID"];
      date = row["Session Date"];
    }

    if (view === "Calls") {
      entity = normalizePhone(row["Phone"]);
      date = row["Call Date"];
    }

    if (!entity || !date) return;

    const time = getTimeBucket(date, granularity);
    if (!time) return;

    map[time] = map[time] || { time, totalEvents: 0 };
    map[time].totalEvents += 1;
  });

  return Object.values(map).sort((a, b) => new Date(a.time) - new Date(b.time));
}

/**************** TASK 3 ****************/
function getOrdersPerCall(granularity) {
  const orders = getAggregatedData("Orders", granularity);
  const calls = getAggregatedData("Calls", granularity);

  const callMap = {};
  calls.forEach(c => callMap[c.time] = c.totalEvents);

  return orders.map(o => ({
    time: o.time,
    ordersPerCall: callMap[o.time]
      ? +(o.totalEvents / callMap[o.time]).toFixed(2)
      : 0
  }));
}

/**************** TASK 3 EXTENSION ****************/
function getSessionsOrdersConversion(granularity) {
  const sessions = getAggregatedData("Sessions", granularity);
  const orders = getAggregatedData("Orders", granularity);

  const orderMap = {};
  orders.forEach(o => orderMap[o.time] = o.totalEvents);

  return sessions.map(s => ({
    time: s.time,
    conversionRate: orderMap[s.time]
      ? +(orderMap[s.time] / s.totalEvents * 100).toFixed(2)
      : 0
  }));
}

module.exports = {
  getAggregatedData,
  getOrdersPerCall,
  getSessionsOrdersConversion
};
