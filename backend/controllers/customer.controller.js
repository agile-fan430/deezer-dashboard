const Customer = require("../models/customer.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const customer = new Customer({
    email: req.body.email,
    name: req.body.name,
    pwd: req.body.pwd,
    country: req.body.country,
    bot_id: req.body.bot_id,
    proxy: req.body.proxy,
    security: req.body.security,
  });

  // Save Customer in the database
  Customer.create(customer, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
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

  var customers = req.body.customers;
  var newcustomers = [];
  customers.forEach(element => {
    const customer = new Customer({
      email: element.email,
      name: element.name,
      pwd: element.password,
      country: element.country,
      bot_id: element.bot_id,
      proxy: element.proxy,
      security: element.security
    });

    // Save Customer in the database
    Customer.create(customer, (err, result) => {
      newcustomers.push(result);
    });

    if(element == customers[customers.length - 1]) {
      res.send(newcustomers);
    }

  });
}

exports.dashboard = (req, res) => {
  Customer.getActive((err, data1) => {
    Customer.getBlock((err2, data2) => {
      res.send({active: data1[0].activeAmount, block: data2[0].blockAmount});
    })
  })
}

exports.changePassword = (req, res) => {
  Customer.changePassword(req.query.id, req.query.password, (err, data) => {
    if(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while change Password"
      });
    }
    else res.send({ success: true });
  })
}

exports.created = (req, res) => {
  Customer.created(req.query.id, (err, data) => {
    if(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while assign created account"
      });
    }
    else res.send({ success: true });
  });
}

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  Customer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

exports.findByPageAndLimit = (req, res) => {
  Customer.findByPageAndLimit(req.query, (err, data) => {
    if(err) {
      if(err.kind === "not_found") {
        res.send({data:[], total: 0});
      } else {
        res.status(500).send({
          message: "Error retrieving customers on page " + req.query._page
        });
      }
    } else {
      Customer.getAll((err, dataAll) => {
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

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  Customer.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.customerId
        });
      }
    } else res.send(data);
  });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Customer.updateById(
    req.params.customerId,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.customerId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.customerId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  Customer.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.customerId
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Customer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers."
      });
    else res.send({ message: `All Customers were deleted successfully!` });
  });
};

// Get random accounts from the database to assign.
exports.getRandomAssign = (req, res) => {
  Customer.getRandomAssign(req.query.bot_id, (err, data) => {
    if(err) 
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting random albums."
      });
    else res.send(data);
  });
}

// Release assigned accounts from bot in database
exports.releaseBot = (req, res) => {
  Customer.release(req.id, (err, data) => {
    if(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while release bot."
      });
    } else {
      res.send(data);
    }
  });
}

exports.updateStatus = (req, res) => {
  if(req.body.status === 1) {
    Customer.updateError({id: req.body.id, message: ''}, (err, data) => {
      if(err) console.log(err);
    });
  }
  Customer.updateStatus(req.body, (err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while update bot status"
      });
    } else {
      res.send(data);
    }
  });
}

exports.updateError = (req, res) => {
  Customer.updateError(req.body, (err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while update bot error message"
      });
    } else {
      Customer.updateStatus({id: req.body.id, status: 0}, (error, result) => {
        if(error) {
          res.status(500).send({
            message: err.message || "Error from update bot status 0"
          });
        } else {
          res.send(result);
        }
      })
    }
  });
}

exports.getCouponExpirationInfo = (req, res) => {
  Customer.getTomorrowExpirationInfo((err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while getting tomrrow expiration"
      });
    } else {
      Customer.get5ExpirationInfo((error, expiration5) => {
        if(error) {
          res.send(500).send({
            message: err.message || "Some error occured while getting 5 day expiration"
          });
        } else {
          Customer.getCouponMissing((err1, expiration0) => {
            if(err1) {
              res.send(500).send({
                message: err1.message || "Some error occured while getting missing coupon"
              });
            } else {
              res.send({
                expiration0,
                expiration1: data,
                expiration5,
              });
            }
          });
        }
      });
    }
  });
}

exports.getActiveAccounts = (req, res) => {
  Customer.getActiveAccounts((err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error happened on getting active accounts"
      });
    } else {
      res.send(data);
    }
  });
}