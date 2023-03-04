var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");


function renderCashTransfer(req, res) {
const username = req.body.username;
const toAccount = req.body.toAccount;
const amount = req.body.amount;
const type = req.body.type;

let toAccountID;
let balance;
  //Check for valid account id
  //Check if deposit or withdraw
  // if withdraw, verify balance has enough
  //insert withdraw/deposit into cash transfer table

    step1(res);




  // Getting account id for sender
  //Get user account that matches search bar
function step1(res) {
  let sql = "CALL check_user(?);"
  dbCon.query(sql, [username], function(err, rows) {
  if (err){
    throw err;
  }
  console.log("employeeTransfer.js: Obtained check_credentials reply from database");
          if (rows[0][0] === undefined || rows[0][0].result == 0) {
              console.log("employeeTransfer.js: No login credentials were found");
              res.render('employeeTransfer', {message: "username: '" + username + "' is not valid, please try again."});
          }
          else {
              console.log("employeeAccounts.js: Credentials matched");
              step2(res, function() {
                step3(res);
              });
          }
      });
  }

function step2(res, _callback) {
  //Getting Balance 
sql = "CALL get_balance(?, ?)";
dbCon.query(sql, [username, toAccount], function(err, rows) {
  if (err) {
    throw err
  }
  console.log("transfer.js: Getting balance");
  let balance = rows[0][0]["balance"];

  _callback();
  // step3(res);
})};

function step3(res){
   //Getting account id
   sql = "CALL get_account_id(?, ?)";
   dbCon.query(sql, [username, toAccount], function(err, rows) {
     if (err) {
       throw err
     }
     console.log("transfer.js: Getting account id");
     let toAccountID = rows[0][0]["account_id"];
     console.log("This is to accountid:" + toAccountID);
     // step3(res);
   });


  //Checking for sufficient funds
if(balance < amount && type == "WITHDRAW") {
 console.log("transfer.js: insufficient funds for transfer");
 message = "Insufficient Balance";
 res.render('employeeTransfer', message);
}
else{
 // Enough funds, initiate transfer
   sql = "CALL insert_cash_transfer(?, ?, ?)";
   dbCon.query(sql, [amount, type, toAccountID], function(err, rows) {
     if (err) {
       throw err
     }
   console.log("employeeTransfer.js: Transfer completed");
   message = "Transfer Completed"
   res.render('employeeTransfer', message);
   }
)};
}
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('employeeTransfer');
});

/* GET home page. */
router.post('/', function(req, res, next) {

renderCashTransfer(req, res);


});

module.exports = router;
