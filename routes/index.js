var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var User = require('../models/User');
var Chat = require('../models/Chat');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/accueuil.html'));
});
router.get('/register', function(req,res,next) {
  res.sendFile(path.join(__dirname, '../views/register.html'));
});
router.get('/login', function(req,res,next) {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});
//POST route for updating data
router.post('/register', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (
    /* req.body.email && */
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

router.post('/login', function(req,res,next) {
  /* return res.send(req.body.username); */
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.save();
        return res.redirect('/chat');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

// GET route after registering
router.get('/chat', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
/*           var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err); */
          return res.redirect('/login');
        } else {
          res.sendFile(path.join(__dirname, '../views/chat.html'));
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.post('/postmessage', function(req, res, next) {
  if(req.session) {
    if(req.body.content) {
      console.log(req.session.userId);
      User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
  /*           var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err); */
            return res.redirect('/login');
          } else {
            var chatData = {
              from: user.username,
              content: req.body.content
            };
            Chat.create(chatData, function (error, user) {
              if (error) {
                return next(error);
              } else {
                console.log('ok');
                res.sendStatus(201);
              }
            });
          }
        }
      });
    }
  }
});
module.exports = router;

module.exports = router;
