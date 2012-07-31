
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');

var app = module.exports = express();

var routes = require('./routes');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/call', routes.hoiio.makecall);

app.post('/on/call', routes.hoiio.call);
app.post('/end/hangup', routes.hoiio.hangup);
app.post('/call', routes.hoiio.handleMakeCall);

app.get('/logs', routes.hoiio.logs);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
