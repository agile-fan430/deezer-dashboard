const Track = require("../models/track.model.js");

// Create and Save a new Track
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Track
  const track = new Track({
    name: req.body.name,
    link: req.body.link,
    status: req.body.status
  });

  // Save track in the database
  Track.create(track, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Track."
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

  var tracks = req.body.tracks;
  var newtracks = [];
  tracks.forEach(element => {
    const track = new Track({
      name: element.name,
      link: element.link,
      status: element.status
    });

    // Save Track in the database
    Track.create(track, (err, res) => {
      newtracks.push(res);
    });

    if(element == tracks[tracks.length - 1]) {
      res.send(newtracks);
    }
  });
}

// Retrieve all tracks from the database.
exports.findAll = (req, res) => {
  Track.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tracks."
      });
    else res.send(data);
  });
};

exports.findByPageAndLimit = (req, res) => {
  Track.findByPageAndLimit(req.query, (err, data) => {
    if(err) {
      if(err.kind === "not_found") {
        res.send({data:[], total: 0});
      } else {
        res.status(500).send({
          message: "Error retrieving tracks on page " + req.query._page
        });
      }
    } else {
      Track.getAll((err, dataAll) => {
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

// Find a single track with a trackId
exports.findOne = (req, res) => {
  Track.findById(req.params.trackId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found track with id ${req.params.trackId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving track with id " + req.params.trackId
        });
      }
    } else res.send(data);
  });
};

// Update a track identified by the trackId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Track.updateById(
    req.params.trackId,
    new Track(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found track with id ${req.params.trackId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating track with id " + req.params.trackId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a track with the specified trackId in the request
exports.delete = (req, res) => {
  Track.remove(req.params.trackId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found track with id ${req.params.trackId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete track with id " + req.params.trackId
        });
      }
    } else res.send({ message: `track was deleted successfully!` });
  });
};

// Delete all tracks from the database.
exports.deleteAll = (req, res) => {
  Track.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tracks."
      });
    else res.send({ message: `All tracks were deleted successfully!` });
  });
};

// get random musics from the database.
exports.getRandomAssign = (req, res) => {
  Track.getRandomAssign((err, data) => {
    if(err) 
      res.status(500).send({
        messag:
          err.message || "Some error occurred while getting random albums."
      });
    else res.send(data);
  });
}