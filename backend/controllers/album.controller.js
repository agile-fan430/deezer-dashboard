const Album = require("../models/album.model.js");

// Create and Save a new Album
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Album
  const album = new Album({
    name: req.body.name,
    link: req.body.link,
    status: req.body.status
  });

  // Save Album in the database
  Album.create(album, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Album."
      });
    else res.send(data);
  });
};

exports.upload = (req, res) => {
  if(!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  var albums = req.body.albums;
  var newAlbums = [];
  albums.forEach(element => {
    const album = new Album({
      name: element.name,
      link: element.link,
      status: element.status
    });

    // Save Album in the database
    Album.create(album, (err, res) => {
      newAlbums.push(res);
    });

    if(element == albums[albums.length - 1]) {
      res.send(newAlbums);
    }
  });
}

// Retrieve all Albums from the database.
exports.findAll = (req, res) => {
  Album.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving albums."
      });
    else res.send(data);
  });
};

exports.findByPageAndLimit = (req, res) => {
  Album.findByPageAndLimit(req.query, (err, data) => {
    if(err) {
      if(err.kind === "not_found") {
        res.send({data:[], total: 0});
      } else {
        res.status(500).send({
          message: "Error retrieving albums on page " + req.query._page
        });
      }
    } else {
      Album.getAll((err, dataAll) => {
        if(err) {
          res.status(500).send({
            messsage: err.message || "Some error ocurred while retrieving customer"
          });
        } else {
          res.send({ data, total: dataAll.length });
        }
      })      
    }
  });
}

// Find a single Album with a albumId
exports.findOne = (req, res) => {
  Album.findById(req.params.albumId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Album with id ${req.params.albumId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Album with id " + req.params.albumId
        });
      }
    } else res.send(data);
  });
};

// Update a Album identified by the albumId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Album.updateById(
    req.params.albumId,
    new Album(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Album with id ${req.params.albumId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Album with id " + req.params.albumId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Album with the specified albumId in the request
exports.delete = (req, res) => {
  Album.remove(req.params.albumId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Album with id ${req.params.albumId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Album with id " + req.params.albumId
        });
      }
    } else res.send({ message: `Album was deleted successfully!` });
  });
};

// Delete all Albums from the database.
exports.deleteAll = (req, res) => {
  Album.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all albums."
      });
    else res.send({ message: `All Albums were deleted successfully!` });
  });
};

exports.getRandomAssign = (req, res) => {
  Album.getRandomAssign((err, data) => {
    if(err) 
      res.status(500).send({
        messag:
          err.message || "Some error occurred while getting random albums."
      });
    else res.send(data);
  });
}