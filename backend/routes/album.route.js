module.exports = app => {
  const albums = require("../controllers/album.controller.js");

  // Create a new Customer
  app.post("/albums", albums.create);

  app.post("/albums/upload", albums.upload);

  // Retrieve page albums by page number and page limit
  app.get("/albums", albums.findByPageAndLimit);

  // Retrieve a single Customer with customerId
  app.get("/albums/:albumId", albums.findOne);

  // Update a Customer with customerId
  app.put("/albums/:albumId", albums.update);

  // Delete a Customer with customerId
  app.delete("/albums/:albumId", albums.delete);

  // Create a new Customer
  app.delete("/albums", albums.deleteAll);
};