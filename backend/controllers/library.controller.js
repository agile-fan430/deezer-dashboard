const Library = require("../models/library.model.js");

// Create and Save a new Library
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Library
  const library = new Library({
    name: req.body.name,
    link: req.body.link,
    status: req.body.status
  });

  // Save library in the database
  Library.create(library, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Library."
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

  var library = req.body.library;
  var newlibrary = [];
  library.forEach(element => {
    const library = new Library({
      name: element.name,
      link: element.link,
      status: element.status
    });

    // Save library in the database
    Library.create(library, (err, res) => {
      newlibrary.push(res);
    });

    if(element == library[library.length - 1]) {
      res.send(newlibrary);
    }
  });
}

// Retrieve all Library from the database.
exports.findAll = (req, res) => {
  Library.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving library."
      });
    else res.send(data);
  });
};

exports.findByPageAndLimit = (req, res) => {
  Library.findByPageAndLimit(req.query, (err, data) => {
    if(err) {
      if(err.kind === "not_found") {
        res.send({data:[], total: 0});
      } else {
        res.status(500).send({
          message: "Error retrieving library on page " + req.query._page
        });
      }
    } else {
      Library.getAll((err, dataAll) => {
        if(err) {
          res.status(500).send({
            messsage: err.message || "Some error ocurred while retrieving library"
          });
        } else {
          res.send({ data, total: dataAll.length });
        }
      })      
    }
  });
}

// Find a single library with a libraryId
exports.findOne = (req, res) => {
  Library.findById(req.params.libraryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found library with id ${req.params.libraryId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving library with id " + req.params.libraryId
        });
      }
    } else res.send(data);
  });
};

// Update a library identified by the libraryId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Library.updateById(
    req.params.libraryId,
    new Library(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found library with id ${req.params.libraryId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating library with id " + req.params.libraryId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a library with the specified libraryId in the request
exports.delete = (req, res) => {
  Library.remove(req.params.libraryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found library with id ${req.params.libraryId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete library with id " + req.params.libraryId
        });
      }
    } else res.send({ message: `library was deleted successfully!` });
  });
};

// Delete all library from the database.
exports.deleteAll = (req, res) => {
  Library.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all library."
      });
    else res.send({ message: `All library were deleted successfully!` });
  });
};

exports.getRandomAssign = (req, res) => {
  Library.getRandomAssign((err, data) => {
    if(err) 
      res.status(500).send({
        messag:
          err.message || "Some error occurred while getting random library."
      });
    else res.send(data);
  });
}