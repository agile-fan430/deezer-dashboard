const sql = require("./db.js");

// constructor
const Library = function(library) {
  this.link = library.link;
  this.name = library.name;
  this.status = library.status;
};

Library.create = (newLibrary, result) => {
  sql.query("INSERT INTO library SET ?", newLibrary, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created library item: ", { id: res.insertId, ...newLibrary });
    result(null, { id: res.insertId, ...newLibrary });
  });
};

Library.findById = (libraryId, result) => {
  sql.query(`SELECT * FROM library WHERE id = ${libraryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found library: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Library with the id
    result({ kind: "not_found" }, null);
  });
};

Library.findByPageAndLimit = (query, result) => {
  let sqlquery = `SELECT * FROM library`;
  if(query.link_like) {
    sqlquery += ` WHERE link LIKE '%${query.link_like}%'`
  }
  sqlquery += ` LIMIT ${(query._page-1) * query._limit}, ${query._page * query._limit};`;
  sql.query(sqlquery, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found library: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  })
}

Library.getRandomAssign = (result) => {
  sql.query(`SELECT * FROM library ORDER BY RAND() LIMIT 10;`, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found library: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
}

Library.getAll = result => {
  sql.query("SELECT * FROM library", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("library: ", res);
    result(null, res);
  });
};

Library.updateById = (id, album, result) => {
  sql.query(
    "UPDATE library SET link = ?, name = ?, status = ? WHERE id = ?",
    [Library.link, Library.name, Library.status, id],
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

      console.log("updated library item: ", { id: id, ...album });
      result(null, { id: id, ...album });
    }
  );
};

Library.remove = (id, result) => {
  sql.query("DELETE FROM library WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found library with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted library with id: ", id);
    result(null, res);
  });
};

Library.removeAll = result => {
  sql.query("DELETE FROM library", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} library`);
    result(null, res);
  });
};

module.exports = Library;