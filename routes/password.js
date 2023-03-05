var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");

function renderPasswordChange(req,res){

  let username = req.session.username;
  let hashed_password = req.body.hash;
  let salt = req.body.salt;

  step1(res);



  function step1(res) {
    //Change password
    let sql = "CALL change_credentials(?,?,?)";
    dbCon.query(sql, [username, hashed_password, salt], function(err, rows){
      if (err) {
        throw err;
      }
      console.log("password.js: Password changed.")
      res.render('password', {message: "Password successfully changed"});
    });
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {

  if (!req.session || !req.session.loggedIn) {
    console.log("survey.js: redirecting to /");
    res.redirect("/");
}

  res.render('password');
});

router.post('/', function(req, res, next) {
  renderPasswordChange(req,res);
});

module.exports = router;
