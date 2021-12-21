const Log = require('../models/log.model.js');

exports.add = (req, res) => {
  if(!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Artist
  const log = new Log({
    account_id: req.body.id,
    content: req.body.logs,
    type: req.body.type
  });

  Log.add(log, (err, data) => {
    if(err) {
      res.status(500).send({
        message: "Error add Log"
      });
    }
    res.send(data)
  });
}


exports.findByPageAndLimit = (req, res) => {
  Log.findByPageAndLimit(req.query, (err, data) => {
    if(err) {
      if(err.kind === "not_found") {
        res.send({data:[], total: 0});
      } else {
        res.status(500).send({
          message: "Error retrieving artists on page " + req.query._page
        });
      }
    } else {
      Log.getAll((err, dataAll) => {
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