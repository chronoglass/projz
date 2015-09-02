module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/', function(req, res) {
    res.render('index');
  });
  app.use(router);
}

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/login', function(req, res) {
    res.redirect('/my');
  });
  app.use(router);
}

module.exports = function(app) {
  var router = app.loopback.Router();
  router.get('/my', function(req, res) {
    res.redirect('/');
  });
  app.use(router);
}