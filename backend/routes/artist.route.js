module.exports = app => {
  const artists = require("../controllers/artist.controller.js");

  // Create a new artist
  app.post("/artists", artists.create);

  app.post('/artists/upload', artists.upload);

  // Retrieve page artists by page number and page limit
  app.get("/artists", artists.findByPageAndLimit);

  // Retrieve a single artist with artistId
  app.get("/artists/:artistId", artists.findOne);

  // Update a artist with artistId
  app.put("/artists/:artistId", artists.update);

  // Delete a artist with artistId
  app.delete("/artists/:artistId", artists.delete);

  // Create a new artist
  app.delete("/artists", artists.deleteAll);
};