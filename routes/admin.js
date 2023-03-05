var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");



function renderRoleChangePage(req, res) {


    //Need to check if account exists
    //Need to fetch account id, first and last name, and current role on first POST
    //Need to submit role change to db upon second post. Second post will have a ProposedType value.
    objForRoleChange = {};
    const username = req.body.search;
    const proposedRole = req.body.purposedRole;
    const user_id = req.body.user_id;
    const role = req.body.role;


    step1(res);
   //Get user account that matches search bar
  
  function step1(res) {
    if(username !== undefined || username == ""){
    let sql = "CALL check_user(?);"
    dbCon.query(sql, [username], function(err, rows) {
      if (err){
        throw err;
        }
      console.log("admin.js: Obtained check_credentials reply from database");
        if (rows[0][0] === undefined || rows[0][0].result == 0) {
          console.log("admin.js: No login credentials were found");
          // objForUsersPage.message = "username: '" + username + "' is not valid, please try again.";
          // renderIt(res);
          res.render('admin', {
            message: "username: '" + username + "' is not valid, please try again.",
          });
          }
        else {
          console.log("admin.js: Credentials matched");
          step2(res);
          }
        });
      }
      else{

      console.log("admin.js: Role Change request detected.")
      console.log("username: " + username + "| user_id: " + user_id + "| role: " + role);


    }
  }
  //Else if username is undefined
  
      
  function step2(res){
    let sql = "CALL get_role_info(?)";
    dbCon.query(sql, [username], function(err, rows){
      if (err){
        throw err
      }
      console.log("admin.js: Getting role info for username");
      console.log("admin.js: Username: " + username);
      objForRoleChange.roleInfo = rows[0];
      console.log(rows);
      res.render('admin', objForRoleChange);
    }
    );
  }
















  //End of render role change
};





/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.loggedIn || req.session.user_type_id != 3) {
    console.log("survey.js: redirecting to /");
    res.redirect("login");
}

  res.render('admin');
});

/* GET home page. */
router.post('/', function(req, res, next) {
  renderRoleChangePage(req, res);
});

module.exports = router;
