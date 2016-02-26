var React = require('react');
var ReactDOMServer = require('react-dom/server');
var DOM = React.DOM;
var body = DOM.body;
var div = DOM.div;
var script = DOM.script;

var browserify = require('browserify');
var babelify = require("babelify");

var express = require('express');
var app = express();

var fs = require('fs');

require('babel/register')({
  ignore: false
});

app.use('/bundle.js', function (req, res) {
  res.setHeader('content-type', 'application/javascript');

  browserify({ debug: true })
    .transform(babelify.configure({presets: ["react", "es2015"]}))
    .require("./app.js", { entry: true })
    .bundle()
    .pipe(res)

/*
  // cache
  browserify({ debug: false})
    .transform(babelify.configure({
      presets: ["react", "es2015"]
    }))
    .require("./app.js", { entry: true })
    .bundle()
    .pipe(fs.createWriteStream('www/bundle.js'))
  */
});

app.use('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  var markup = ''

  var html = '<!DOCTYPE html>\n'+ReactDOMServer.renderToStaticMarkup(body(null,
      div({id: 'app',}),
      script({src: '/bundle.js'})
  ))

  res.end(html);

  // cache as file
  //fs.writeFile('www/index.html', html)
})

app.listen(3000, function() {});
