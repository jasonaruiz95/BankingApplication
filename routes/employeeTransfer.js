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
              step2(res);
          }
      });
  }

function step2(res) {
  //Getting Balance 
sql = "CALL get_balance(?, ?)";
dbCon.query(sql, [username, toAccount], function(err, rows) {
  if (err) {
    throw err
  }
  console.log("transfer.js: Getting balance");
  balance = rows[0][0]["balance"];
  console.log("employeeTransfer.js: This is balance: " + balance);
  step3(res);
})};

function step3(res){
//Getting account id
sql = "CALL get_account_id(?, ?)";
dbCon.query(sql, [username, toAccount], function(err, rows) {
  if (err) {
    throw err
  }
  console.log("employeeTransfer.js: Getting account id");
  toAccountID = rows[0][0]["account_id"];
  console.log("This is to accountid:" + toAccountID);
  step4(res);
});
};

function step4(res){
   


  //Checking for sufficient funds
  console.log("employeeTransfer.js: This is type: " + type);
  console.log("employeeTransfer.js: This is balance inside step 3: " + balance);
if(balance < amount && type == "WITHDRAW") {
 console.log("transfer.js: insufficient funds for transfer");
 res.render('employeeTransfer', {message: "Insufficient Balance"});
}
else{
  console.log("This is to accountid inside step3:" + toAccountID);
 // Enough funds, initiate transfer
   sql = "CALL insert_cash_transfer(?, ?, ?)";
   dbCon.query(sql, [amount, type, toAccountID], function(err, rows) {
     if (err) {
       throw err
     }
   console.log("employeeTransfer.js: Transfer completed");
   res.render('employeeTransfer', {message: "Transfer Completed"});
   }
)};
}
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('employeeTransfer');
});

/* POST home page. */
router.post('/', function(req, res, next) {

renderCashTransfer(req, res);


});

module.exports = router;
