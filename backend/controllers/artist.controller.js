const Artist = require("../models/artist.model.js");

// Create and Save a new Artist
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Artist
  const artist = new Artist({
    name: req.body.name,
    link: req.body.link,
    status: req.body.status
  });

  // Save Artist in the database
  Artist.create(artist, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Artist."
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

  var artists = req.body.artists;
  var newartists = [];
  artists.forEach(element => {
    const artist = new Artist({
      name: element.name,
      link: element.link,
      status: element.status
    });

    // Save Artist in the database
    Artist.create(artist, (err, res) => {
      newartists.push(res);
    });

    if(element == artists[artists.length - 1]) {
      res.send(newartists);
    }
  });
}

// Retrieve all Artists from the database.
exports.findAll = (req, res) => {
  Artist.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving artists."
      });
    else res.send(data);
  });
};

exports.findByPageAndLimit = (req, res) => {
  Artist.findByPageAndLimit(req.query, (err, data) => {
    if(err) {
      if(err.kind === "not_found") {
        res.send({data:[], total: 0});
      } else {
        res.status(500).send({
          message: "Error retrieving artists on page " + req.query._page
        });
      }
    } else {
      Artist.getAll((err, dataAll) => {
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

// Find a single Artist with a artistId
exports.findOne = (req, res) => {
  Artist.findById(req.params.artistId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found artist with id ${req.params.artistId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving artist with id " + req.params.artistId
        });
      }
    } else res.send(data);
  });
};

// Update a Artist identified by the artistId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Artist.updateById(
    req.params.artistId,
    new Artist(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Artist with id ${req.params.artistId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Artist with id " + req.params.artistId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Artist with the specified artistId in the request
exports.delete = (req, res) => {
  Artist.remove(req.params.artistId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Artist with id ${req.params.artistId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Artist with id " + req.params.artistId
        });
      }
    } else res.send({ message: `Artist was deleted successfully!` });
  });
};

// Delete all Artists from the database.
exports.deleteAll = (req, res) => {
  Artist.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Artists."
      });
    else res.send({ message: `All Artists were deleted successfully!` });
  });
};

//get random artists from the database.
exports.getRandomAssign = (req, res) => {
  Artist.getRandomAssign((err, data) => {
    if(err) 
      res.status(500).send({
        messag:
          err.message || "Some error occurred while getting random albums."
      });
    else res.send(data);
  });
}