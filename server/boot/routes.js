module.exports = function(app) {
  var router = app.loopback.Router();
  var authorized = true;
  
  router.get('/', function(req, res) {
    res.render('index', {title: 'Did you do it yet'});
  });
  
  
  router.post('/login', function(req, res) {
    res.redirect('/my');
  });
  
  
  router.get('/my', function(req, res) {
    res.redirect('/');
  });
  
  router.get('/a', function(req, res) {
    if(authorized){
      res.render('admin', {title: 'DYDIY admin panel'})
    }
  });
  router.get('/stat', app.loopback.status());
  app.use(router);
}