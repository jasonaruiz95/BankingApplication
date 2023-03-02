var express = require('express');
var router = express.Router();
var dbCon = require('../lib/database');

function renderTimingsPage(req, res, userTime, userTimingType) {
  // Prepare results for the user page.  
  // 1) Get top 10 transactions
  // 2) The median font color time
  // 3) The top ten font color times
  // 4) The median text word time
  // 5) The top ten text word times
  objForTransactionsEJS = {}


  // #1
  function step1(res) {
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
      // step4(res);
    });
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('customer');
});

module.exports = router;
