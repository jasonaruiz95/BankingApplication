var express = require('express');
var router = express.Router();
var dbCon = require('../lib/database');


function renderEmpTransfersPage(req, res) {
  // Prepare results for the user page.  

  objForTransfersEJS = {}
  let username = req.body.search;
  let fromAccount;
  let fromAccountID;
  console.log("This is username:" + username);

  step1(res);

  //Get user account that matches search bar
function step1(res) {
  let sql = "CALL check_user(?);"
  dbCon.query(sql, [username], function(err, rows) {
    if (err){
      throw err;
      }
    console.log("employeeTransferHistory.js: Obtained check_credentials reply from database");
    if (rows[0][0] === undefined || rows[0][0].result == 0) {
      console.log("employeeTransferHistory.js: No login credentials were found");
      // objForUsersPage.message = "username: '" + username + "' is not valid, please try again.";
      // renderIt(res);
      res.render('employeeTransferHistory', {message: "username: '" + username + "' is not valid, please try again."});
      }
    else {
      console.log("employeeTransferHistory.js: Credentials matched");
      step2(res);
      }
    });
    }; 

  function step2(res) {


    // Getting checking account id for user
    fromAccount = "Checking";
    let sql = "CALL get_account_id(?,?)";
    dbCon.query(sql, [username, fromAccount], function(err, rows) {
      if (err) {
        throw err
      }
      console.log("employeeTransferHistory.js: Getting account id");
      fromAccountID = rows[0][0]["account_id"];
      console.log("This is fromaccountid:" + fromAccountID);
      step3(res);
    });

    
  
    
  }
  //Getting top ten transfers from accountid and to accountid
  function step3(res){
    console.log("Starting get top ten transfers from account id");
    console.log("This is from accountid:" + fromAccountID);
    sql = "CALL get_top_ten_transfers_from('" + fromAccountID +"')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForTransfersEJS.topTenTransfersFrom = rows[0];
      // renderIt(res);
    });

    console.log("Starting get top ten transfers to account id");
    console.log("This is toaccountid:" + fromAccountID);
    sql = "CALL get_top_ten_transfers_to('" + fromAccountID +"')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForTransfersEJS.topTenTransfersTo = rows[0];
      renderIt(res);
    });
  }


  function renderIt(res) {
    // pass it data!
    res.render('employeeTransferHistory', objForTransfersEJS);
  }
}



/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.loggedIn || req.session.user_type_id != 2) {
    console.log("survey.js: redirecting to /");
    res.redirect("login");
}
  res.render('employeeTransferHistory');
  // renderEmpTransfersPage(req, res);
});

/* POST home page. */
router.post('/', function(req, res, next) {
  renderEmpTransfersPage(req, res);
});


module.exports = router;
