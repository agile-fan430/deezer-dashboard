const CreditCard = require("../models/creditcard.model.js");

// Create and Save a new CreditCard
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a CreditCard
  const card = new CreditCard({
    cardNo: req.body.cardNo,
    expiry: req.body.expiry,
    securitycode: req.body.securitycode,
    isUsed: req.body.isUsed
  });

  // Save CreditCard in the database
  CreditCard.create(card, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Card."
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

  var cards = req.body.cards;
  var newCards = [];
  cards.forEach(element => {
    const card = new CreditCard({
      cardNo: element.cardNo,
      expiry: element.expiry,
      securitycode: element.securitycode,
      isUsed: element.isUsed
    });

    // Save CreditCard in the database
    CreditCard.create(card, (err, res) => {
      newCards.push(res);
    });

    if(element == cards[cards.length - 1]) {
      res.send(newCards);
    }
  });
}

// Retrieve all CreditCards from the database.
exports.findAll = (req, res) => {
  CreditCard.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CreditCards."
      });
    else res.send(data);
  });
};

exports.findByPageAndLimit = (req, res) => {
  CreditCard.findByPageAndLimit(req.query, (err, data) => {
    if(err) {
      if(err.kind === "not_found") {
        res.send({data:[], total: 0});
      } else {
        res.status(500).send({
          message: "Error retrieving CreditCards on page " + req.query._page
        });
      }
    } else {
      CreditCard.getAll((err, dataAll) => {
        if(err) {
          res.status(500).send({
            messsage: err.message || "Some error ocurred while retrieving cards"
          });
        } else {
          res.send({ data, total: dataAll.length });
        }
      })      
    }
  });
}

// Find a single CreditCard with a CreditCardId
exports.findOne = (req, res) => {
  CreditCard.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found CreditCard with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving CreditCard with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a CreditCard identified by the CreditCardId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  CreditCard.updateById(
    req.params.id,
    new CreditCard(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found CreditCard with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating CreditCard with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a CreditCard with the specified CreditCardId in the request
exports.delete = (req, res) => {
  CreditCard.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found CreditCard with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete CreditCard with id " + req.params.id
        });
      }
    } else res.send({ message: `CreditCard was deleted successfully!` });
  });
};

// Delete all CreditCards from the database.
exports.deleteAll = (req, res) => {
  CreditCard.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all CreditCards."
      });
    else res.send({ message: `All CreditCards were deleted successfully!` });
  });
};

//get random CreditCards from the database.
exports.getRandomAssign = (req, res) => {
  CreditCard.getRandomAssign((err, data) => {
    if(err) 
      res.status(500).send({
        messag:
          err.message || "Some error occurred while getting random albums."
      });
    else res.send(data);
  });
}

exports.usedOne = (req, res) => {
  CreditCard.used(req.params.id, (err, data) => {
    if(err) 
      res.status(500).send({
        messag:
          err.message || "Some error occurred while getting random albums."
      });
    else res.send(data);
  });
}