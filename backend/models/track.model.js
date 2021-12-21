const sql = require("./db.js");

// constructor
const Track = function(track) {
  this.link = track.link;
  this.name = track.name;
  this.status = track.status;
};

Track.create = (newTrack, result) => {
  sql.query("INSERT INTO tracks SET ?", newTrack, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created track: ", { id: res.insertId, ...newTrack });
    result(null, { id: res.insertId, ...newTrack });
  });
};

Track.findById = (trackId, result) => {
  sql.query(`SELECT * FROM tracks WHERE id = ${trackId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found track: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found track with the id
    result({ kind: "not_found" }, null);
  });
};

Track.findByPageAndLimit = (query, result) => {
  let sqlquery = `SELECT * FROM tracks`;
  if(query.link_like) {
    sqlquery += ` WHERE link LIKE '%${query.link_like}%'`
  }
  sqlquery += ` LIMIT ${(query._page-1) * query._limit}, ${query._limit};`;
  sql.query(sqlquery, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found tracks: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  })
}

Track.getRandomAssign = (result) => {
  sql.query(`SELECT * FROM tracks ORDER BY RAND() LIMIT 50;`, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found tracks: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
}

Track.getAll = result => {
  sql.query("SELECT * FROM tracks", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tracks: ", res);
    result(null, res);
  });
};

Track.updateById = (id, track, result) => {
  sql.query(
    "UPDATE tracks SET link = ?, name = ?, status = ? WHERE id = ?",
    [Track.link, Track.name, Track.status, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found track with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated track: ", { id: id, ...track });
      result(null, { id: id, ...track });
    }
  );
};

Track.remove = (id, result) => {
  sql.query("DELETE FROM tracks WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found tracks with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted track with id: ", id);
    result(null, res);
  });
};

Track.removeAll = result => {
  sql.query("DELETE FROM tracks", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tracks`);
    result(null, res);
  });
};

module.exports = Track;