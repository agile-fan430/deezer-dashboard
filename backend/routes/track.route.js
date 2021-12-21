module.exports = app => {
  const tracks = require("../controllers/track.controller.js");

  // Create a new Customer
  app.post("/tracks", tracks.create);

  app.post('/tracks/upload', tracks.upload);

  // Retrieve page tracks by page number and page limit
  app.get("/tracks", tracks.findByPageAndLimit);

  // Retrieve a single Customer with customerId
  app.get("/tracks/:trackId", tracks.findOne);

  // Update a Customer with customerId
  app.put("/tracks/:trackId", tracks.update);

  // Delete a Customer with customerId
  app.delete("/tracks/:trackId", tracks.delete);

  // Create a new Customer
  app.delete("/tracks", tracks.deleteAll);
};