var express = require('express');
var router = express.Router();
var dbCon = require('../lib/database');

function renderTransfersPage(req, res) {
  // Prepare results for the user page.  
  // 1) Get top ten transfers
  objForTransfersEJS = {}


  step1(res);

  function step1(res) {
    const username = req.session.username;
    let fromAccount;
    let fromAccountID;
    console.log("This is username:" + username);

    // Getting checking account id for user
    fromAccount = "Checking";
    let sql = "CALL get_account_id(?,?)";
    dbCon.query(sql, [username, fromAccount], function(err, rows) {
      if (err) {
        throw err
      }
      console.log("transfer.js: Getting account id");
      fromAccountID = rows[0][0]["account_id"];
      // console.log("This is fromaccountid:" + fromAccountID);
    });

    //Getting top ten transfers from accountid
    console.log("This is fromaccountid:" + fromAccountID);
    sql = "CALL get_top_ten_transfers('" + fromAccountID +"')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForTransfersEJS.topTentransfers = rows[0];
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
  // res.render('transferHistory');
  renderTransfersPage(req, res);
});

/* POST home page. */
router.post('/', function(req, res, next) {
  // transfer(req, res);



  // res.render('transfers');
});


module.exports = router;
