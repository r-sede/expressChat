/*jshint esversion:6*/
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var busboy = require('connect-busboy');


mongoose.connect('mongodb://localhost/chat');

//overide mongoose promise library
mongoose.Promise = Promise;
const socket_io    = require( "socket.io" );
const app = express();
const io= socket_io();
app.io=io;


const indexRouter = require('./routes/index')(io);
const usersRouter = require('./routes/users');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',//env
  resave: true,
  saveUninitialized: false
}));

io.on("connection", (socket) => {
  console.log("Socket is connected...");
});

 // app.use(function printSession(req, res, next) {
 //    console.log('req.session', req.session);
 //    return next();
 //  }); 

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
