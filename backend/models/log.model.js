const sql = require('./db.js');

const Log = function(log) {
  this.account_id = log.account_id;
  this.content = log.content;
  this.log_time = log.log_time;
  this.type = log.type;
};

Log.add = (log, result) => {
  log.log_time = new Date();
  sql.query("INSERT INTO logs SET ?", log, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, { id: res.insertId, ...log });
  })
}

Log.findByPageAndLimit = (query, result) => {
  let sqlquery = `SELECT logs.id, customers.email, logs.content, logs.log_time, logs.type FROM logs, customers WHERE logs.account_id=customers.id`;
  if(query.email_like) {
    sqlquery += ` AND (customers.email LIKE '%${query.email_like}%' OR logs.content LIKE '%${query.content_like}%')`
  }
  sqlquery += ` ORDER BY logs.id DESC LIMIT ${(query._page-1) * query._limit}, ${query._limit};`;
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

Log.getAll = result => {
  sql.query("SELECT * FROM logs", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  })
}

module.exports = Log;