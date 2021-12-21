const sql = require("./db.js");

// constructor
const Artist = function(artist) {
  this.link = artist.link;
  this.name = artist.name;
  this.status = artist.status;
};

Artist.create = (newArtist, result) => {
  sql.query("INSERT INTO artists SET ?", newArtist, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created artist: ", { id: res.insertId, ...newArtist });
    result(null, { id: res.insertId, ...newArtist });
  });
};

Artist.findById = (artistId, result) => {
  sql.query(`SELECT * FROM artists WHERE id = ${artistId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found artist: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found artist with the id
    result({ kind: "not_found" }, null);
  });
};

Artist.getRandomAssign = (result) => {
  sql.query(`SELECT * FROM artists ORDER BY RAND() LIMIT 10;`, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found artists: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
}

Artist.findByPageAndLimit = (query, result) => {
  let sqlquery = `SELECT * FROM artists`;
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
      console.log("found artists: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  })
}

Artist.getAll = result => {
  sql.query("SELECT * FROM artists", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("artists: ", res);
    result(null, res);
  });
};

Artist.updateById = (id, artist, result) => {
  sql.query(
    "UPDATE artists SET link = ?, name = ?, status = ? WHERE id = ?",
    [artist.link, artist.name, artist.status, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found artist with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated artist: ", { id: id, ...artist });
      result(null, { id: id, ...artist });
    }
  );
};

Artist.remove = (id, result) => {
  sql.query("DELETE FROM artists WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found artists with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted artist with id: ", id);
    result(null, res);
  });
};

Artist.removeAll = result => {
  sql.query("DELETE FROM artists", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} artists`);
    result(null, res);
  });
};

module.exports = Artist;