module.exports = app => {
  const settings = require('../controllers/setting.controller.js');

  app.get('/settings', settings.get);

  app.post('/settings', settings.update);
}