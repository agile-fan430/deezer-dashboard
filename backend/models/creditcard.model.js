const sql = require('./db.js');

const CreditCard = function(card) {
  this.cardNo = card.cardNo;
  this.expiry = card.expiry;
  this.securitycode = card.securitycode;
  this.isUsed = card.isUsed;
};

CreditCard.create = (newCard, result) => {
  sql.query("INSERT INTO creditcards SET ?", newCard, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created card: ", { id: res.insertId, ...newCard });
    result(null, { id: res.insertId, ...newCard });
  });
};

CreditCard.findById = (cardId, result) => {
  sql.query(`SELECT * FROM creditcards WHERE id = ${cardId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found card: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found card with the id
    result({ kind: "not_found" }, null);
  });
};

CreditCard.getRandomAssign = (result) => {
  sql.query(`SELECT * FROM creditcards WHERE isUsed=0 ORDER BY RAND() LIMIT 1;`, (err, res) => {
    if(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if(res.length) {
      console.log("found creditcards: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
}

CreditCard.findByPageAndLimit = (query, result) => {
  let sqlquery = `SELECT * FROM creditcards`;
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
      console.log("found creditcards: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  })
}

CreditCard.getAll = result => {
  sql.query("SELECT * FROM creditcards", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("creditcards: ", res);
    result(null, res);
  });
};

CreditCard.used = (id, result) => {
  sql.query("UPDATE creditcards SET isUsed = ? WHERE id = ?", [true, id], (err, res) => {
    if(err) {
      result(null, err);
      return;
    }

    if(res.affectedRows == 0) {
      result({ kind: 'not_found'}, null);
      return ;
    }

    result(null, { id: id})
  })
}

CreditCard.updateById = (id, card, result) => {
  sql.query(
    "UPDATE creditcards SET cardNo = ?, expiry = ?, securitycode = ?, isUsed = ? WHERE id = ?",
    [card.cardNo, card.expiry, card.securitycode, card.isUsed, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found card with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated card: ", { id: id, ...card });
      result(null, { id: id, ...card });
    }
  );
};

CreditCard.remove = (id, result) => {
  sql.query("DELETE FROM creditcards WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found creditcards with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted card with id: ", id);
    result(null, res);
  });
};

CreditCard.removeAll = result => {
  sql.query("DELETE FROM creditcards", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} creditcards`);
    result(null, res);
  });
};

module.exports = CreditCard;