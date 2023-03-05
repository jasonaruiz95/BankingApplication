var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");


function transfer(req, res){
  const username = req.session.username;
  const fromAccount = req.body.fromAccount;
  const toAccount = req.body.toAccount;
  const memo = req.body.memo;
  const amount = req.body.amount;
  let toAccountID;
  const recipient = req.body.recipient

  //Internal or external transfer? external requires account ID, whereas internal you can reference the username.
  //Check if there is sufficient balance to make the transfer
  //call transfer stored proc

  objForTransferEJS = {};
  
  // #1
  step1(res);

  function step1(res) {

    // Getting account id for sender
    let sql = "CALL get_account_id(?,?)";
    dbCon.query(sql, [username, fromAccount], function(err, rows) {
      if (err) {
        throw err
      }
      console.log("transfer.js: Getting account id");
      fromAccountID = rows[0][0]["account_id"];
      console.log("This is fromaccountid:" + fromAccountID);
      step2(res)
    });




    function step2(res){
       //If transfer is going to another user, grab account id from dom
    if(toAccount == "Other"){
      toAccountID = req.body.accountID;
      console.log("tranfser.js: External transfer to" + toAccountID);
      step3(res);
    }
    else{
      // Getting account id for senders other account
    let sql = "CALL get_account_id(?,?)";
    dbCon.query(sql, [username, toAccount], function(err, rows) {
      if (err) {
        throw err
      }
      console.log("transfer.js: Getting account id");
      toAccountID = rows[0][0]["account_id"];
      step3(res, toAccountID);
    });
    }
    }
   
    function step3(res) {
      //Getting Balance 
    sql = "CALL get_balance(?, ?)";
    dbCon.query(sql, [username, fromAccount], function(err, rows) {
      if (err) {
        throw err
      }
      console.log("transfer.js: Getting balance");
      let balance = rows[0][0]["balance"];
      console.log("This is username:" + username);
      console.log("This is fromAccount:" + fromAccount);
      console.log("This is balance query:" + balance);
      console.log("This is amount:" + amount);

      
      

      //Checking for sufficient funds
      if(balance < amount) {
        console.log("transfer.js: insufficient funds for transfer");
        objForTransferEJS.message = "Insufficient Balance";
        res.render('transfers', objForTransferEJS);
      }
      else{
        // Enough funds, initiate transfer
          sql = "CALL insert_transfer(?, ?, ?, ?, ?)";
          dbCon.query(sql, [amount, recipient, memo, fromAccountID, toAccountID], function(err, rows) {
            if (err) {
              throw err
            }
          console.log("transfer.js: Transfer completed");
          objForTransferEJS.message = "Transfer Completed"
          res.render('transfers', objForTransferEJS);

          }
    )};
    });
    }
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.loggedIn) {
    console.log("customer.js: redirecting to /");
    res.redirect("/");
}

  res.render('transfers');
});

/* POST home page. */
router.post('/', function(req, res, next) {
  transfer(req, res);



  // res.render('transfers');
});
module.exports = router;
