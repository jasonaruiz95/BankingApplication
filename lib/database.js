let mysql = require('mysql2');

var dbConnectionInfo = require('./connectionInfo');

var con = mysql.createConnection({
  host: dbConnectionInfo.host,
  user: dbConnectionInfo.user,
  password: dbConnectionInfo.password,
  port: dbConnectionInfo.port,
  multipleStatements: true              // Needed for stored proecures with OUT results
});

con.connect(function(err) {
  if (err) {
    throw err;
  }
  else {
    console.log("database.js: Connected to server!");
    
    con.query("CREATE DATABASE IF NOT EXISTS banking_application", function (err, result) {
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log("database.js: banking_application database created if it didn't exist");
      selectDatabase();
    });
  }
});

function selectDatabase() {
    let sql = "USE banking_application";
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: Selected banking_application database");
        createTables();
        createStoredProcedures();
        addDummyDataToDatabase();
      }
    });
}

function createTables() {
    // A CREATE TABLE call will work if it does not exist or if it does exist.
    // Either way, that's what we want.
    let sql = "CREATE TABLE IF NOT EXISTS user_types(\n" +
                "user_type_id INT NOT NULL AUTO_INCREMENT,\n" +
                "user_type VARCHAR(255) NOT NULL,\n" +
                "PRIMARY KEY (user_type_id)\n" +
                  ")";
                con.execute(sql, function(err, results, fields) {
                if (err) {
                console.log(err.message);
                throw err;
                } else {
                console.log("database.js: user type table created if it didn't exist");
                }
                });
    
    sql = "CREATE TABLE IF NOT EXISTS users(\n" +
                "user_id INT NOT NULL AUTO_INCREMENT,\n" +
                "first_name VARCHAR(255) NOT NULL,\n" +
                "last_name VARCHAR(255) NOT NULL,\n" +
                "email VARCHAR(255) NOT NULL,\n" +
                "password VARCHAR(255) NOT NULL,\n" +
                "user_type_id INT NOT NULL,\n" +
                "PRIMARY KEY (user_id),\n" +
                "FOREIGN KEY (user_type_id) REFERENCES user_types (user_type_id)\n" +
              ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
      console.log(err.message);
      throw err;
      } else {
      console.log("database.js: users table created if it didn't exist");
      }
      });
      

    
      

    sql = "CREATE TABLE IF NOT EXISTS accounts(\n" +
                "account_id INT NOT NULL AUTO_INCREMENT,\n" +
                "balance INT NOT NULL,\n" +
                "account_name VARCHAR(255) NOT NULL,\n" +
                "user_id INT NOT NULL,\n" +
                "PRIMARY KEY (account_id),\n" +
                "FOREIGN KEY (user_id) REFERENCES users (user_id)\n" +
              ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
      console.log(err.message);
      throw err;
      } else {
      console.log("database.js: accounts table created if it didn't exist");
      }
      });
      

      sql = "CREATE TABLE IF NOT EXISTS transactions(\n" +
                "transaction_id INT NOT NULL AUTO_INCREMENT,\n" +
                "amount INT NOT NULL,\n" +
                "timestamp DATETIME NOT NULL,\n" +
                "recipient VARCHAR(255) NOT NULL,\n" +
                "memo VARCHAR(255),\n" +
                "account_id INT NOT NULL,\n" +
                "PRIMARY KEY (transaction_id),\n" +
                "FOREIGN KEY (account_id) REFERENCES accounts (account_id)\n" +
              ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
      console.log(err.message);
      throw err;
      } else {
      console.log("database.js: transactions table created if it didn't exist");
      }
      });

      sql = "CREATE TABLE IF NOT EXISTS transfers(\n" +
                "transaction_id INT NOT NULL AUTO_INCREMENT,\n" +
                "amount INT NOT NULL,\n" +
                "timestamp DATETIME NOT NULL,\n" +
                "recipient VARCHAR(255) NOT NULL,\n" +
                "memo VARCHAR(255),\n" +
                "account_id INT NOT NULL,\n" +
                "receiving_account_id INT NOT NULL,\n" +
                "PRIMARY KEY (transaction_id),\n" +
                "FOREIGN KEY (account_id) REFERENCES accounts (account_id)\n" +
    ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
      console.log(err.message);
      throw err;
      } else {
      console.log("database.js: transfers table created if it didn't exist");
      }
      });


    }

    function createStoredProcedures() {
        let sql = "CREATE PROCEDURE IF NOT EXISTS `insert_user`(\n" +
                      "IN first_name VARCHAR(45),\n" +
                      "IN last_name VARCHAR(45),\n" +
                      "IN email VARCHAR(45),\n" +
                      "IN password VARCHAR(45),\n" +
                      "IN user_type_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                  "INSERT INTO users (first_name, last_name, email, password, user_type_id)\n" +
                  "VALUES(first_name, last_name, email, password, 1);\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure insert_user created if it didn't exist");
      }
    });

    
    sql = "CREATE PROCEDURE IF NOT EXISTS `insert_user_type`(\n" +
                      "IN user_type VARCHAR(45)\n" +
                  ")\n" +
                  "BEGIN\n" +
                  "INSERT INTO user_types (user_type)\n" +
                  "SELECT user_type FROM DUAL\n" +
                  "WHERE NOT EXISTS (\n" +
                    "SELECT * FROM user_types\n" +
                    "WHERE user_types.user_type=user_type LIMIT 1\n" +
                  ");\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure insert_user_type created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `insert_account`(\n" +
                      "IN account_name VARCHAR(45),\n" +
                      "IN user_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                  "INSERT INTO accounts (balance, account_name, user_id)\n" +
                  "VALUES(0, account_name, 1);\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure insert_account created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `insert_transfer`(\n" +
                      "IN amount INT,\n" +
                      "IN recipient VARCHAR(45),\n" +
                      "IN memo VARCHAR(45),\n" +
                      "IN account_id INT,\n" +
                      "IN receiving_account_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                  "INSERT INTO transfers (amount, timestamp, recipient, account_id, receiving_account_id)\n" +
                  "VALUES(amount, (SELECT CURRENT_TIMESTAMP()), recipient, account_id, receiving_account_id);\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure insert_transfer created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `insert_transaction`(\n" +
                      "IN amount INT,\n" +
                      "IN recipient VARCHAR(45),\n" +
                      "IN memo VARCHAR(45),\n" +
                      "IN account_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                  "INSERT INTO transactions (amount, timestamp, recipient, memo, account_id)\n" +
                  "VALUES(amount, (SELECT CURRENT_TIMESTAMP()), recipient, memo, account_id);\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure insert_transaction created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_type_admin`(\n" +
                      "IN user_id INT,\n" +
                      "IN user_type_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                    "UPDATE users\n" +
                    "SET \n" +
                    "user_type_id = \n " +
                    "(SELECT user_type_id FROM user_types WHERE user_types.user_type = 'admin')\n" +
                    "WHERE users.user_id = user_id;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure change_user_type_admin created if it didn't exist");
      }
    });

    sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_type_employee`(\n" +
                      "IN user_id INT,\n" +
                      "IN user_type_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                    "UPDATE users\n" +
                    "SET \n" +
                    "user_type_id = \n " +
                    "(SELECT user_type_id FROM user_types WHERE user_types.user_type = 'employee')\n" +
                    "WHERE users.user_id = user_id;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure change_user_type_employee created if it didn't exist");
      }
    });

    sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_type_customer`(\n" +
                      "IN user_id INT,\n" +
                      "IN user_type_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                    "UPDATE users\n" +
                    "SET \n" +
                    "user_type_id = \n " +
                    "(SELECT user_type_id FROM user_types WHERE user_types.user_type = 'customer')\n" +
                    "WHERE users.user_id = user_id;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure change_user_type_customer created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `update_balance`(\n" +
                     "IN account_id INT,\n" +    
                     "IN balance INT\n" + 
                  ")\n" +
                  "BEGIN\n" +
                    "UPDATE accounts\n" +
                    "SET \n" +
                    "accounts.balance = balance\n " +
                    "WHERE accounts.account_id = account_id;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure update_balance created if it didn't exist");
      }
    });


    }

    function addDummyDataToDatabase() {
        let sql = "CALL insert_user_type('customer')";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'customer' to user_types");
        });

        sql = "CALL insert_user_type('employee')";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'employee' to user types");
        });

        sql = "CALL insert_user_type('admin')";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'admin' to user types");
        });
    
        sql = "CALL insert_user('jason', 'ruiz', 'smelly@aol.com', 'avada kedavra', 1)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'jason' to users");
        });

        sql = "CALL insert_account('checking', 1)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'checking' to accounts");
        });

        sql = "CALL insert_account('savings', 1)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'savings' to accounts");
        });

        sql = "CALL insert_transfer(10, 'Cynthia', 'Netflix shared account', 1, 2)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transfer' to transfers table");
        });
        
        sql = "CALL insert_transaction(100, 'Target', 'nothing', 1)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transaction' to transactions table");
        });
    }

    module.exports = con;