var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");


function renderAdminPasswordChange(req, res) {
  let hashed_password = req.body.hash
  let salt = req.body.salt
  let username = req.body.username


  step1(res);
  //Get user account that matches search bar
function step1(res) {
  let sql = "CALL check_user(?);"
  dbCon.query(sql, [username], function(err, rows) {
    if (err){
      throw err;
      }
    console.log("adminPasswordReset.js: Obtained check_credentials reply from database");
    if (rows[0][0] === undefined || rows[0][0].result == 0) {
      console.log("adminPasswordReset.js: No login credentials were found");
      // objForUsersPage.message = "username: '" + username + "' is not valid, please try again.";
      // renderIt(res);
      res.render('adminPasswordReset', {message: "username: '" + username + "' is not valid, please try again."});
      }
    else {
      console.log("adminPasswordReset.js: Credentials matched");
      step2(res);
      }
    });
    }; 
function step2(res) {
  //Change password
  let sql = "CALL change_credentials(?,?,?)";
  dbCon.query(sql, [username, hashed_password, salt], function(err, rows){
    if (err) {
      throw err;
    }
    console.log("adminPasswordReset.js: Password changed.")
    res.render('adminPasswordReset', {message: "Password successfully changed"});
  });
}

}

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.loggedIn || req.session.user_type_id != 3) {
    console.log("survey.js: redirecting to /");
    res.redirect("login");
}
  res.render('adminPasswordReset');
});

/* GET home page. */
router.post('/', function(req, res, next) {
  renderAdminPasswordChange(req, res);
});

module.exports = router;
