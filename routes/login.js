var express = require('express');
var router = express.Router();
var dbCon = require('../lib/database');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("login.js: GET")
  res.render('login');
});
/* POST page. */
router.post('/', function(req, res, next) {
  console.log("loginpassword.js: POST");
  console.log("The logged in variable is'" + req.session.loggedIn + "'");
  console.log("The username in variable is'" + req.body.username + "'");

  if (req.body.hashedPassword) {
      //User is submitting user/password credentials
      const username = req.session.username;
      const hashedPassword = req.body.hashedPassword;
      const sql = "CALL check_credentials('" + username + "','" + hashedPassword + "')";
      dbCon.query(sql, function(err, results) {
          if (err) {
              throw err;
          }
          console.log("Loginuser.js: Obtained check_credentials reply from database");
          if (results[0][0] === undefined || results[0][0].result == 0) {
              console.log("Loginuser.js: No login credentials were found");
              res.render('login', {message: "Password not valid for user '" + username + "'. Please log in again."});
          }
          else {
              console.log("loginuser.js: Credentials matched");
              req.session.loggedIn = true;
              res.redirect("/");
          }
      });
  }
  else if (req.body.username != "") {
      const username = req.body.username;
      console.log("loginuser.js:  username is: " + username);
      const sql = "CALL get_salt('" + username + "')";
      dbCon.query(sql, function(err, results) {
          if (err) {
              throw err;
          }
          if (results[0][0] === undefined) {
              console.log("loginuser: No results found");
              res.render('login', {message: "User '" + username + "' not found"});
          } else {
              const salt = results[0][0].salt;
              req.session.username = username;
              req.session.salt = salt;
              req.session.education_type = results[0][0].education_type;
              res.render('loginpassword', {
                  username: username,
                  salt: salt
              });
          }
      });
  }
});

module.exports = router;
