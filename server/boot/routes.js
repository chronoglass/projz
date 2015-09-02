module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/ping', function(req, res) {
    res.send('pongaroo');
  });
  app.use(router);
}

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/pong', function(req, res) {
    res.send('pingaroo');
  });
  app.use(router);
}