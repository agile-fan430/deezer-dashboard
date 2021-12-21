const sql = require("./db.js");

// constructor
const Album = function(album) {
  this.link = album.link;
  this.name = album.name;
  this.status = album.status;
};

Album.create = (newAlbum, result) => {
  sql.query("INSERT INTO albums SET ?", newAlbum, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created album: ", { id: res.insertId, ...newAlbum });
    result(null, { id: res.insertId, ...newAlbum });
  });
};

Album.findById = (albumId, result) => {
  sql.query(`SELECT * FROM albums WHERE id = ${albumId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found album: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Album with the id
    result({ kind: "not_found" }, null);
  });
};

Album.findByPageAndLimit = (query, result) => {
  let sqlquery = `SELECT * FROM albums`;
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
      console.log("found albums: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  })
}

Album.getRandomAssign = (result) => {
  sql.query(`SELECT * FROM albums ORDER BY RAND() LIMIT 10;`, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found albums: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
}

Album.getAll = result => {
  sql.query("SELECT * FROM albums", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("albums: ", res);
    result(null, res);
  });
};

Album.updateById = (id, album, result) => {
  sql.query(
    "UPDATE albums SET link = ?, name = ?, status = ? WHERE id = ?",
    [album.link, album.name, album.status, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found album with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated album: ", { id: id, ...album });
      result(null, { id: id, ...album });
    }
  );
};

Album.remove = (id, result) => {
  sql.query("DELETE FROM albums WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Albums with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted album with id: ", id);
    result(null, res);
  });
};

Album.removeAll = result => {
  sql.query("DELETE FROM albums", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} albums`);
    result(null, res);
  });
};

module.exports = Album;