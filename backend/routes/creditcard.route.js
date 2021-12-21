module.exports = app => {
  const cards = require("../controllers/creditcard.controller.js");

  // Create a new Customer
  app.post("/cards", cards.create);

  app.post("/cards/upload", cards.upload);

  // Retrieve page cards by page number and page limit
  app.get("/cards", cards.findByPageAndLimit);

  // Retrieve a single Customer with customerId
  app.get("/cards/:id", cards.findOne);

  // Update a Customer with customerId
  app.put("/cards/:id", cards.update);

  // Delete a Customer with customerId
  app.delete("/cards/:id", cards.delete);

  // Create a new Customer
  app.delete("/cards", cards.deleteAll);
};