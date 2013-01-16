/**
 * OW2 API Sample
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , app = express();

var Gitorious = require('gitoriou.js').Gitorious;

var config = {
  url : 'http://gitorious.ow2.org',
  port : 3000
}

var client = new Gitorious(config);
app.configure(function() {
  app.set('port', process.env.PORT || config.port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, '../public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.get('/projects', function(req, res) {
  client.getProjects(function(err, result) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(200, result);
    }
  });
});

app.get('/project/:name', function(req, res) {
  client.getProject(req.param('name'), function(err, result) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(200, result);
    }
  });
});

var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('OW2 Server is started and listening on', app.get('port'));
});