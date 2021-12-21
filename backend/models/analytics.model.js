const sql = require('./db.js');

function getCurrentDate() {
    let now = new Date();

    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = now.getFullYear();

    let today = mm + '/' + dd + '/' + yyyy;
    return today;
}

const Analytic = function(analytic) {
    this.play_amounts = analytic.play_amounts ? analytic.play_amounts : 0;
    this.active_accounts = analytic.active_accounts ? analytic.active_accounts : 0;
    this.saved_for = analytic.saved_for;
}

Analytic.add = (amount, result) => {
    let currentDate = getCurrentDate();
    sql.query('SELECT * from analytics WHERE saved_for = ?;', [currentDate], (error, res1) => {
        if(error) {
            console.log('error: ', error);
            result1(error, null);
            return;
        }
        if(res1.length) {
            sql.query('UPDATE analytics SET play_amounts = play_amounts + ? WHERE saved_for = ?', [amount, currentDate], (err, res2) => {
                if(err) {
                    console.log('error on update analytics for today', err);
                    result(err, null);
                    return;
                }

                result(null, { success: true });
            });
            
            return;
        } else {
            let analytic = new Analytic({
                play_amounts: amount,
                saved_for: getCurrentDate()
            });
            sql.query('INSERT INTO analytics SET ?', analytic, (err, res2) => {
                if(err) {
                    console.log('error on creating analytics for today: ', err);
                    result(err, null);
                    return;
                }

                result(null, { id: res2.insertId, ...analytic});
            });
        }
    });
}

Analytic.increaseActiveAccount = (result) => {
    let currentDate = getCurrentDate();
    sql.query('SELECT * from analytics WHERE saved_for = ?;', [currentDate], (error, res1) => {
        if(error) {
            console.log('error: ', error);
            result1(error, null);
            return;
        }
        if(res1.length) {
            sql.query('UPDATE analytics SET active_accounts = active_accounts + 1 WHERE saved_for = ?', [currentDate], (err, res2) => {
                if(err) {
                    console.log('error on update analytics for today', err);
                    result(err, null);
                    return;
                }

                result(null, { success: true });
            });
            
            return;
        } else {
            let analytic = new Analytic({
                active_accounts: 1,
                saved_for: getCurrentDate()
            });
            sql.query('INSERT INTO analytics SET ?', analytic, (err, res2) => {
                if(err) {
                    console.log('error on creating analytics for today: ', err);
                    result(err, null);
                    return;
                }

                result(null, { id: res2.insertId, ...analytic});
            });
        }
    });
}

Analytic.decreaseActiveAccount = (result) => {
    let currentDate = getCurrentDate();
    sql.query('SELECT * from analytics WHERE saved_for = ?;', [currentDate], (error, res1) => {
        if(error) {
            console.log('error: ', error);
            result1(error, null);
            return;
        }
        if(res1.length) {
            sql.query('UPDATE analytics SET active_accounts = active_accounts - 1 WHERE saved_for = ?', [currentDate], (err, res2) => {
                if(err) {
                    console.log('error on update analytics for today', err);
                    result(err, null);
                    return;
                }

                result(null, { success: true });
            });
            
            return;
        } else {
            let analytic = new Analytic({
                active_accounts: 1,
                saved_for: getCurrentDate()
            });
            sql.query('INSERT INTO analytics SET ?', analytic, (err, res2) => {
                if(err) {
                    console.log('error on creating analytics for today: ', err);
                    result(err, null);
                    return;
                }

                result(null, { id: res2.insertId, ...analytic});
            });
        }
    });
}

Analytic.findByPageAndLimit = (query, result) => {
    console.log(query);
    let sqlquery = `SELECT * from analytics`;
    if(query.saved_for_like) {
        sqlquery += ` WHERE saved_for LIKE '%${query.saved_for_like}%'`;
    }
    sqlquery += ` ORDER BY id DESC LIMIT ${(query._page - 1) * query._limit}, ${query._limit};`;
    sql.query(sqlquery, (err, res) => {
        console.log(err);
        console.log(res);
        if(err) {
            result(err, null);
            return;
        }
        if(res.length > 0) {
            result(null, res);
            return;
        }

        result({ kind: "not_found" }, null);
    })
}

Analytic.totalAmount = (query, result) => {
    let sqlquery = `SELECT COUNT(id) as total from analytics`;
    if(query.saved_for_like) {
        sqlquery += ` WHERE saved_for LIKE '%${query.saved_for_like}%'`;
    }
    sql.query(sqlquery, (err, res) => {
        if(err) {
            result(err, null);
            return;
        }
        result(null, res);
    })
}

module.exports = Analytic;