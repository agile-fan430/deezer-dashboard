module.exports = app => {
    const analytics = require('../controllers/analytic.controller.js');

    app.get('/analytics', analytics.findByPageAndLimit);
}