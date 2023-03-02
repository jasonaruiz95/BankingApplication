var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

/* POST page. */
router.post('/', function(req, res, next) {
  console.log("register.js: POST")
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.uniqueEmail;
  let hashed_password = req.body.hash
  let salt = req.body.salt
  // let gender = req.body.genderList
  // let education = req.body.education
  let sql = "CALL insert_user(?, ?, ?, ?, ?, @result); SELECT @result";
  console.log("Create.js: sql statement is: " + sql)
  dbCon.query(sql, [firstName, lastName, username, hashed_password, salt], function(err, rows) {
      if (err) {
          throw err;
      }
      if (rows[1][0]['@result'] == 0) {
          //Successful registration
          // Set the sessions variable for this
          req.session.username = username;
          req.session.loggedIn = true;

          req.session.save(function(err) {
              if (err) {
                  throw err;
              }
              console.log("register.js: successful registration, a session field is: " + req.session.username);

              //Create checking and Savings accounts
              let sql = "CALL insert_account(?, ?)";
              console.log("Create.js: sql statement is: " + sql)
              dbCon.query(sql, ['Checking', req.session.username], function(err, rows) {
                  if (err) {
                      throw err;
                  }
                  else {

                  }
                });

                console.log("Create.js: sql statement is: " + sql)
                dbCon.query(sql, ['Savings', req.session.username], function(err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
  
                    }
                  });

              res.redirect('customer'); 
          });
      } else {
          console.log("register.js: username already exists. Reload register page with that message. ");
          res.render('register', {message: "The username " + username +  " already exists"})
      }
  });
});


module.exports = router;
