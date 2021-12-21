const Analytic = require('../models/analytics.model.js');

exports.addPlayAmount = (req, res) => {
    Analytic.add(req.query.amount, (err, response) => {
        if(err)
            res.status(500).send({
                message: err.message || 'error on update amount'
            });
        else res.send(response);
    });
}

exports.addActiveAccount = (req, res) => {
    Analytic.increaseActiveAccount((err, response) => {
        if(err)
            res.status(500).send({
                message: err.message || 'error on update active'
            });
        else res.send(response);
    });
}

exports.findByPageAndLimit = (req, res) => {
    Analytic.findByPageAndLimit(req.query, (err, data) => {
        if(err) {
            if(err.kind === "not_found") {
                res.send({ data: [], total: 0 });
            } else {
                res.status(500).send({
                    message: "Error to get analytics on page " + req.query._page
                });
            }
        } else {
            Analytic.totalAmount(req.query, (error, result) => {
                if(error) {
                    res.status(500).send({
                       message:  "error on getting total number of analytics"
                    });
                } else {
                    res.send({ data, total: result[0].total });
                }
            });
        }
    });
}