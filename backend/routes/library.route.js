module.exports = app => {
  const library = require("../controllers/library.controller.js");

  // Create a new artist
  app.post("/library", library.create);

  app.post('/library/upload', library.upload);

  // Retrieve page library by page number and page limit
  app.get("/library", library.findByPageAndLimit);

  // Retrieve a single artist with artistId
  app.get("/library/:artistId", library.findOne);

  // Update a artist with artistId
  app.put("/library/:artistId", library.update);

  // Delete a artist with artistId
  app.delete("/library/:artistId", library.delete);

  // Create a new artist
  app.delete("/library", library.deleteAll);
};