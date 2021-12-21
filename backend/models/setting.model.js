const sql = require('./db.js');

const Setting = function(setting) {
  this.min_play = setting.min_play;
  this.max_play = setting.max_play;
  this.percent_play = setting.percent_play;
  this.library_rotation = setting.library_rotation;
  // this.search_title = setting.search_title;
  this.min_rotation = setting.min_rotation;
  this.max_rotation = setting.max_rotation;
  this.local_time = setting.local_time;
  this.min_stream = setting.min_stream;
  this.max_stream = setting.max_stream;
  this.min_pause = setting.min_pause;
  this.max_pause = setting.max_pause;
  this.min_pause_frequency = setting.min_pause_frequency;
  this.max_pause_frequency = setting.max_pause_frequency;
  this.add_library = setting.add_library;
};

Setting.get = (result) => {
  sql.query("SELECT * FROM setting WHERE id = 1;", (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if(res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("get setting");
    result(null, res);
  })
}

Setting.update = (setting, result) => {
  sql.query(
    `UPDATE setting
      SET min_play = ?,
          max_play = ?,
          percent_play = ?,
          min_rotation = ?,
          max_rotation = ?,
          local_time = ?,
          min_stream = ?,
          max_stream = ?,
          min_pause = ?,
          max_pause = ?,
          min_pause_frequency = ?,
          max_pause_frequency = ?,
          library_rotation = ?,
          add_library = ?
      WHERE id = 1;`,
    [ setting.min_play,
      setting.max_play,
      setting.percent_play,
      setting.min_rotation,
      setting.max_rotation,
      setting.local_time,
      setting.min_stream,
      setting.max_stream,
      setting.min_pause,
      setting.max_pause,
      setting.min_pause_frequency,
      setting.max_pause_frequency,
      setting.library_rotation,
      // setting.search_title,
      setting.add_library
    ],
    (err, res) => {
      if(err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if(res.affectedRows == 0) {
        result({ kind: "not_found"}, null);
        return;
      }

      console.log("setting updated");
      result(null, setting);
    }
  );
};

module.exports = Setting;