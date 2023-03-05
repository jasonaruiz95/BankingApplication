var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adminRoles');
});


/* GET home page. */
router.post('/', function(req, res, next) {
  const user_id = req.body.postUser_ID;
  const proposedRole = req.body.proposedRole;

  console.log("This is proposed Role: " + proposedRole + " This is user id: " + user_id);
  if(user_id){
  let sql = "CALL change_user_type(?,?)"
  dbCon.query(sql, [user_id, proposedRole], function(err, rows){
    if (err) {
      throw err;
    }

    console.log("adminRoles.js: Change user request submitted")
    message = "Users role has been changed to: " + proposedRole;
    res.render('adminRoles', {message: "Users role has been changed to: " + proposedRole});

  });
  }
  else{
    res.render('adminRoles');
  }
});

module.exports = router;
