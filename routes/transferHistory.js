var express = require('express');
var router = express.Router();
var dbCon = require('../lib/database');

function renderTransfersPage(req, res) {
  // Prepare results for the user page.  
  // 1) Get top ten transfers
  objForTransfersEJS = {}
  const username = req.session.username;
  let fromAccount;
  let fromAccountID;
  console.log("This is username:" + username);

  step1(res);

  function step1(res) {


    // Getting checking account id for user
    fromAccount = "Checking";
    let sql = "CALL get_account_id(?,?)";
    dbCon.query(sql, [username, fromAccount], function(err, rows) {
      if (err) {
        throw err
      }
      console.log("transfer.js: Getting account id");
      fromAccountID = rows[0][0]["account_id"];
      console.log("This is fromaccountid:" + fromAccountID);
      step2(res);
    });

    
  
    
  }
  //Getting top ten transfers from accountid and to accountid
  function step2(res){
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
    res.render('transferHistory', objForTransfersEJS);
  }
}



/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.loggedIn) {
    console.log("customer.js: redirecting to /");
    res.redirect("/");
}
  renderTransfersPage(req, res);
});


module.exports = router;
