var express = require('express');
var router = express.Router();
var dbCon = require('../lib/database');

function renderTransactionsPage(req, res) {
  // Prepare results for the user page.  
  // 1) Get balance
  // 2) Get top 10 transactions
  // 3) The top ten font color times
  // 4) The median text word time
  // 5) The top ten text word times
  objForTransactionsEJS = {}

  step1(res)
  // #1
  function step1(res) {
    let sql = "CALL get_balance('" + req.session.username + "', 'Checking')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForTransactionsEJS.balanceChecking = rows[0][0]["balance"];
    });

    sql = "CALL get_balance('" + req.session.username + "', 'Savings')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForTransactionsEJS.balanceSavings = rows[0][0]["balance"];
    });
    step2(res)
  }



  // #2
  function step2(res) {
    let sql = "CALL get_top_ten_transactions('" + req.session.username + "', 'Checking')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForTransactionsEJS.topTenChecking = rows[0];
      // step4(res);
    });
    
    sql = "CALL get_top_ten_transactions('" + req.session.username + "', 'Savings')";
    dbCon.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log(rows);
      objForTransactionsEJS.topTenSavings = rows[0];
      renderIt(res);
    });
  }


  function renderIt(res) {
    // pass it data!
    res.render('customer', objForTransactionsEJS);
  }

}


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('customer');
  renderTransactionsPage(req, res);
});

module.exports = router;
