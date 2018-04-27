var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');

//overide mongoose promise library
mongoose.Promise = Promise;
var socket_io    = require( "socket.io" );
var app = express();
var io= socket_io();
app.io=io;

var indexRouter = require('./routes/index')(io);
var usersRouter = require('./routes/users');




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

io.on("connection", (socket) => {
  console.log("Socket is connected...")
});

/* app.use(function printSession(req, res, next) {
    console.log('req.session', req.session);
    return next();
  }); */

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
