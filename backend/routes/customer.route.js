module.exports = app => {
  const customers = require("../controllers/customer.controller.js");

  // Create a new Customer
  app.post("/customers", customers.create);

  app.post("/customers/upload", customers.upload);

  app.get("/customers/dashboard", customers.dashboard);

  // Retrieve page customers by page number and page limit
  app.get("/customers", customers.findByPageAndLimit);

  app.get("/customers/getCouponExpiration", customers.getCouponExpirationInfo);

  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", customers.findOne);

  // Update a Customer with customerId
  app.put("/customers/:customerId", customers.update);

  // Delete a Customer with customerId
  app.delete("/customers/:customerId", customers.delete);

  // Create a new Customer
  app.delete("/customers", customers.deleteAll);
};