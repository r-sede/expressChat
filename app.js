var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');
mongoose.Promise = Promise;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',//env
  resave: true,
  saveUninitialized: false
}));


/* app.use(function printSession(req, res, next) {
    console.log('req.session', req.session);
    return next();
  }); */

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
