/*jshint esversion:6*/
module.exports = function (io) {

  var express = require('express');
  var router = express.Router();
  var path = require('path');
  var bodyParser = require('body-parser');
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
  var User = require('../models/User');
  var Chat = require('../models/Chat');

  var fs = require('fs-extra');
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
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      };
      
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/chat');
        }
      });
      
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  });
  
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
  router.get('/profile', function(req, res, next){
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
          res.sendFile(path.join(__dirname, '../views/profile.html'));
        }
      }
    });
  });

  router.post('/updateAvatar', function(req,res,next) {
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
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                console.log("Uploading: " + filename);
    
                //Path where image will be uploaded
                fstream = fs.createWriteStream(__dirname + '/../public/images/avatars/' + filename);
                file.pipe(fstream);
                fstream.on('close', function () {    
                    console.log("Upload Finished of " + filename);
                    
                    User.findByIdAndUpdate(user._id ,  {avatar:'images/avatars/'+filename},null,err=>{
                      if(!err) {
                        res.redirect('back');
                      }
                    });
                    /* user.set({avatar : 'images/'+filename}); */

                });
            });
          }
        }
      });
  });

    // GET route after registering
    router.get('/getProfile', function(req, res, next){
      User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            /*var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err); */
            return res.redirect('/login');
          } else {
            res.json({'avatar': user.avatar, 'username': user.username});
          }
        }
      });
    });

  router.get('/chat', function (req, res, next) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          /*var err = new Error('Not authorized! Go back!');
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
      req.session.destroy(function (error) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/login');
        }
      });
    }
  });

  router.get('/messages', function(req,res,next) {
    let messages = [];
    let authUser; 
     User.findById(req.session.userId)
      .then((user,err) => {
        if(!user) { throw Error('Noonn!'); }

        authUser = user;
        return Chat.find({}).sort({'created_at':-1}).limit(5);
      })
      .catch(err => {
        console.log(err);
        return res.redirect('/login');
      })
      .then(chats => {
        chats.forEach(itm => {
          const className = (authUser.username === itm.from) ? 'me' : 'other';
          
          // jshint ignore:start
          messages.push({
              ...itm._doc,
              className: className,
              avatar: itm.fromavatar
            });
          // jshint ignore:end
        });
        return res.json(messages);
      })
      .catch(err => next(err));
  });
  
  router.post('/postmessage', function(req, res, next) {
    if (req.session) {
      req.body.content = req.body.content.trim();
      if (req.body.content) {
        /*       console.log(req.session.userId); */
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
              // console.log(user.avatar);
              var chatData = {
                // fromid:user_id,
                fromavatar: user.avatar,
                from: user.username,
                content: req.body.content
              };
              Chat.create(chatData, function (error, chat) {
                if (error) {
                  return next(error);
                } else {
                  io.emit("chat", chat);
                  console.log('ok');
                  res.sendStatus(201);
                }
              });
            }
          }
        });
      }
    }//rdeirect
  });
  
  return router;
};
