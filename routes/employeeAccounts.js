var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");

objForUsersPage = {};

function renderUsersPage(req, res) {
  

let username = req.body.search;

step1(res);


//Get user account that matches search bar
function step1(res) {
  let sql = "CALL check_user(?);"
  dbCon.query(sql, [username], function(err, rows) {
    if (err){
      throw err;
      }
    console.log("employeeAccounts.js: Obtained check_credentials reply from database");
    if (rows[0][0] === undefined || rows[0][0].result == 0) {
      console.log("employeeAccounts.js: No login credentials were found");
      // objForUsersPage.message = "username: '" + username + "' is not valid, please try again.";
      // renderIt(res);
      res.render('employeeAccounts', {message: "username: '" + username + "' is not valid, please try again."});
      }
    else {
      console.log("employeeAccounts.js: Credentials matched");
      step2(res);
      }
    });
    }; 
//Get username Balance info
function step2(res){
  let sql = "CALL get_balance('" + username + "', 'Checking')";
  dbCon.query(sql, function(err,rows){
    if (err) {
      console.log(err.message);
      throw err;
    }
    console.log(rows);
    objForUsersPage.balanceChecking = rows[0][0]["balance"];
  });

  sql = "CALL get_balance('" + username + "', 'Savings')";
  dbCon.query(sql, function(err,rows){
    if (err) {
      console.log(err.message);
      throw err;
    }
    console.log(rows);
    objForUsersPage.balanceSavings = rows[0][0]["balance"];
    step3(res);
  }); 
};

  //Get username transactions
  function step3(res) {
    let sql = "CALL get_top_ten_transactions('" + req.session.username + "', 'Checking')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForUsersPage.topTenChecking = rows[0];
    });
    
    sql = "CALL get_top_ten_transactions('" + req.session.username + "', 'Savings')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForUsersPage.topTenSavings = rows[0];
      renderIt(res);
    });
  };

function renderIt(res) {
  res.render('employeeAccounts', objForUsersPage);
};
  
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('employeeAccounts', {
    objForUsersPage
  });
});


/* POST home page. */
router.post('/', function(req, res, next) {
  renderUsersPage(req, res);
});

module.exports = router;
