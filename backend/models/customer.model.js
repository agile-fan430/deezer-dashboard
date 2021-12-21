const sql = require("./db.js");

// constructor
const Customer = function(customer) {
  this.email = customer.email;
  this.name = customer.name;
  this.pwd = customer.pwd;
  this.country = customer.country;
  this.bot_id = customer.bot_id;
  this.proxy = customer.proxy;
  this.security = customer.security;
};

Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", { id: res.insertId, ...newCustomer });
    result(null, { id: res.insertId, ...newCustomer });
  });
};

Customer.findById = (customerId, result) => {
  sql.query(`SELECT * FROM customers WHERE id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.getRandomAssign = (bot_id, result) => {
  sql.query(`SELECT * FROM customers WHERE bot_id=${bot_id}`, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found customers: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
}

Customer.findByPageAndLimit = (query, result) => {
  let sqlquery = `SELECT * FROM customers`;
  if(query.email_like) {
    sqlquery += ` WHERE email LIKE '%${query.email_like}%' OR bot_id LIKE '%${query.bot_id_like}%' OR proxy LIKE '%${query.proxy_like}%'`
  }
  sqlquery += ` LIMIT ${(query._page-1) * query._limit}, ${query._limit};`;
  sql.query(sqlquery, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found customers: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  })
}

Customer.getAll = result => {
  sql.query("SELECT * FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};

Customer.updateById = (id, customer, result) => {
  sql.query(
    "UPDATE customers SET email = ?, name = ?, pwd = ?, country = ?, proxy = ?, bot_id = ?, security = ? WHERE id = ?",
    [customer.email, customer.name, customer.pwd, customer.country, customer.proxy, customer.bot_id, customer.security, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated customer: ", { id: id, ...customer });
      result(null, { id: id, ...customer });
    }
  );
};

Customer.remove = (id, result) => {
  sql.query("DELETE FROM customers WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

Customer.removeAll = result => {
  sql.query("DELETE FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} customers`);
    result(null, res);
  });
};

Customer.changePassword = (accountId, password, result) => {
  sql.query("UPDATE customers SET pwd = ? where bot_id = ?", [password, accountId], (err, res) => {
      if(err) {
        result(null, err);
        return;
      }
      result(null, res);
    });
}

Customer.getActive = result => {
  sql.query("SELECT count(id) as activeAmount FROM customers WHERE active='Active';", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
}

Customer.getBlock = result => {
  sql.query("SELECT count(id) as blockAmount FROM customers WHERE active='Block';", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
}


Customer.updateStatus = (body, result) => {
  let id = body.id;
  let status = body.status;

  sql.query("UPDATE customers SET status = ? WHERE id = ?;", [status, id], (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
}

Customer.updateError = (body, result) => {
  let id = body.id;
  let message = body.message;

  sql.query("UPDATE customers SET error = ? WHERE id = ?;", [message, id], (err, res) => {
    if(err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
}


Customer.getTomorrowExpirationInfo = (result) => {
  sql.query("SELECT count(id) as amount from customers WHERE expiration > CURDATE() and expiration < (CURDATE() + interval 2 day);", (err, res) => {
    if(err) {
      console.log("Error", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
}

Customer.get5ExpirationInfo = (result) => {
  sql.query("SELECT count(id) as amount from customers where expiration > CURDATE() and expiration < (CURDATE() + interval 6 day);", (err, res) => {
    if(err) {
      console.log("Error:", err);
      result(null, err);
      return;
    }

    result(null,  res);
  })
}

Customer.getCouponMissing = (result) => {
  sql.query('SELECT count(id) as amount from customers where expiration < CURDATE();', (err, res) => {
    if(err) {
      console.log("Error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
}

Customer.getActiveAccouts = (result) => {
  sql.query("SELECT count(id) as amount FROM customers WHERE status = 1;", (err, res) => {
    if(err) {
      console.log("Error:", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
}
module.exports = Customer;