module.exports = app => {
  const logs = require("../controllers/logs.controller.js");

  // Retrieve page albums by page number and page limit
  app.get("/logs", logs.findByPageAndLimit);
};