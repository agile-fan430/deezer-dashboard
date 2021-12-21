const Setting = require('../models/setting.model.js');

exports.get = (req, res) => {
  if(!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Setting.get(
    (err, data) => {
      if(err) {
        res.status(500).send({
          message: "Error get setting"
        });
      }

      res.send(data)
    }
  )
}

exports.update = (req, res) => {
  if(!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Setting.update(
    new Setting(req.body),
    (err, data) => {
      if(err) {
        res.status(500).send({
          message: "Error updating Setting"
        });
      } else res.send(data);
    }
  );
};
