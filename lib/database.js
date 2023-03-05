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
                "username VARCHAR(255) NOT NULL,\n" +
                "hashed_password VARCHAR(255) NOT NULL,\n" +
                "salt VARCHAR(255) NOT NULL,\n" +
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


      sql = "CREATE TABLE IF NOT EXISTS cash_transfers(\n" +
                "cash_transfer_id INT NOT NULL AUTO_INCREMENT,\n" +
                "amount INT NOT NULL,\n" +
                "timestamp DATETIME NOT NULL,\n" +
                "type VARCHAR(255),\n" +
                "account_id INT NOT NULL,\n" +
                "PRIMARY KEY (cash_transfer_id),\n" +
                "FOREIGN KEY (account_id) REFERENCES accounts (account_id)\n" +
    ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
      console.log(err.message);
      throw err;
      } else {
      console.log("database.js: cash transfers table created if it didn't exist");
      }
      });
    }

    function createStoredProcedures() {
        let sql = "CREATE PROCEDURE IF NOT EXISTS `insert_user`(\n" +
                      "IN first_name VARCHAR(45),\n" +
                      "IN last_name VARCHAR(45),\n" +
                      "IN username VARCHAR(255),\n" +
                      "IN hashed_password VARCHAR(255),\n" +
                      "IN salt VARCHAR(255),\n" +
                      "OUT result INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                    "DECLARE nCount INT DEFAULT 0;\n" +
                    "SET result = 0;\n" +
                    "SELECT Count(*) INTO nCount FROM users WHERE users.username = username;\n" +
                    "IF nCount = 0 THEN\n" +
                      "INSERT INTO users (first_name, last_name, username, hashed_password, salt, user_type_id)\n" +
                      "VALUES(first_name, last_name, username, hashed_password, salt,  (SELECT user_type_id FROM user_types WHERE user_type = 'customer'));\n" +
                    "ELSE\n" +
                    "SET result = 1;\n" +
                "END IF;\n" +
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
                      "IN username VARCHAR(255)\n" +
                  ")\n" +
                  "BEGIN\n" +
                  "INSERT INTO accounts (balance, account_name, user_id)\n" +
                  "VALUES(0, account_name, (SELECT user_id FROM users u WHERE u.username = username));\n" +
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
                  "CALL update_balance(account_id, (SELECT SUM(a.balance - amount) FROM accounts a WHERE a.account_id = account_id));\n" +
                  "CALL update_balance(receiving_account_id, (SELECT SUM(a.balance + amount) FROM accounts a WHERE a.account_id = receiving_account_id));\n" +
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
                  "CALL update_balance(account_id, (SELECT SUM(a.balance - amount) FROM accounts a WHERE a.account_id = account_id));\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure insert_transaction created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `insert_cash_transfer`(\n" +
                      "IN amount INT,\n" +
                      "IN type VARCHAR(45),\n" +
                      "IN account_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                  "INSERT INTO cash_transfers (amount, timestamp, type, account_id)\n" +
                  "VALUES(amount, (SELECT CURRENT_TIMESTAMP()), type, account_id);\n" +
                  "IF type = 'WITHDRAW' THEN\n" +
                  "INSERT INTO transactions (amount, timestamp, recipient, memo, account_id)\n" +
                  "VALUES(amount, (SELECT CURRENT_TIMESTAMP()), (SELECT first_name FROM users u INNER JOIN accounts a on u.user_id = a. user_id WHERE a.account_id = account_id LIMIT 1), type, account_id);\n" +
                  "CALL update_balance(account_id, (SELECT SUM(a.balance - amount) FROM accounts a WHERE a.account_id = account_id));\n" +
                  "ELSEIF type = 'DEPOSIT' THEN\n" +
                  "INSERT INTO transactions (amount, timestamp, recipient, memo, account_id)\n" +
                  "VALUES(amount, (SELECT CURRENT_TIMESTAMP()), (SELECT first_name FROM users u INNER JOIN accounts a on u.user_id = a. user_id WHERE a.account_id = account_id LIMIT 1), type, account_id);\n" +
                  "CALL update_balance(account_id, (SELECT SUM(a.balance + amount) FROM accounts a WHERE a.account_id = account_id));\n" +
                  "END IF;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure insert_transaction created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `change_user_type`(\n" +
                      "IN user_id INT,\n" +
                      "IN user_type_id INT\n" +
                  ")\n" +
                  "BEGIN\n" +
                    "UPDATE users u\n" +
                    "SET \n" +
                    "u.user_type_id = \n " +
                    "(SELECT user_type_id FROM user_types ut WHERE ut.user_type = user_type)\n" +
                    "WHERE u.user_id = user_id;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure change_user_type created if it didn't exist");
      }
    });
    
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

    
    sql = "CREATE PROCEDURE IF NOT EXISTS `get_top_ten_transactions`(\n" +
                     "IN username VARCHAR(255),\n" +
                     "IN account_name VARCHAR(255)\n" +    
                  ")\n" +
                  "BEGIN\n" +
                    "SELECT recipient, amount, timestamp, memo\n" +
                    "FROM transactions t\n" +
                    "INNER JOIN accounts a ON t.account_id = a.account_id\n" +
                    "INNER JOIN users u ON u.user_id = a.user_id\n" +
                    "WHERE t.account_id = \n" +
                    "(SELECT account_id FROM accounts a INNER JOIN users u ON a.user_id = u.user_id WHERE u.username = username AND a.account_name = account_name)\n" +
                    "ORDER BY t.timestamp DESC\n" +
                    "LIMIT 10;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_top_ten_transactions created if it didn't exist");
      }
    });



    sql = "CREATE PROCEDURE IF NOT EXISTS `get_top_ten_transfers_from`(\n" +
                     "IN account_id VARCHAR(255)\n" +   
                  ")\n" +
                  "BEGIN\n" +
                    "SELECT recipient, amount, timestamp, memo\n" +
                    "FROM transfers t\n" +
                    "WHERE t.account_id = account_id\n" +
                    "ORDER BY t.timestamp DESC\n" +
                    "LIMIT 10;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_top_ten_transactions_from created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `get_top_ten_transfers_to`(\n" +
                     "IN account_id VARCHAR(255)\n" +   
                  ")\n" +
                  "BEGIN\n" +
                    "SELECT recipient, amount, timestamp, memo\n" +
                    "FROM transfers t\n" +
                    "WHERE t.receiving_account_id = account_id\n" +
                    "ORDER BY t.timestamp DESC\n" +
                    "LIMIT 10;\n" +
              "END;";
    
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_top_ten_transactions_to created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `get_users`(\n" +
              "IN username VARCHAR(255)\n" +
          ")\n" +
          "BEGIN\n" +
            "IF username = '' THEN\n" +
            "SELECT *\n" +
            "FROM users u\n" +
            "LIMIT 10; \n" +
            "ELSE\n" +
            "SELECT *\n" +
            "FROM users u WHERE u.username = username \n" +
            "LIMIT 10; \n" +
            "END IF;\n" +
          "END;";
  
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_users created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `get_role_info`(\n" +
              "IN username VARCHAR(255)\n" +
          ")\n" +
          "BEGIN\n" +
            "SELECT u.user_id , CONCAT(u.first_name, ' ', u.last_name) as Name, (SELECT user_type from user_types ut INNER JOIN users u ON u.user_type_id = ut.user_type_id WHERE u.username = username) as Role\n" +
            "FROM users u\n" +
            "WHERE u.username = username; \n" +
          "END;";
  
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_role_info created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `check_credentials`(\n" +
              "IN username VARCHAR(255),\n" +
              "IN hashed_password VARCHAR(255)\n" +
          ")\n" +
          "BEGIN\n" +
              "SELECT EXISTS(\n" +
                "SELECT * FROM users\n" +
                "WHERE users.username = username AND users.hashed_password = hashed_password\n" +
              ") AS result;\n" +
          "END;";
  
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure check_credentials created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `get_salt`(\n" +
              "IN username VARCHAR(255)\n" +
          ")\n" +
          "BEGIN\n" +
              "SELECT salt FROM users\n" +
              "WHERE users.username = username\n" +
              "LIMIT 1;\n" +
          "END;";
  
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_salt created if it didn't exist");
      }
    });


    sql = "CREATE PROCEDURE IF NOT EXISTS `get_balance`(\n" +
              "IN username VARCHAR(255),\n" +
              "IN account_name VARCHAR(255)\n" +
          ")\n" +
          "BEGIN\n" +
              "SELECT balance FROM accounts a\n" +
              "JOIN users u ON u.user_id = a.user_id\n" +
              "WHERE u.username = username AND a.account_name = account_name\n" +
              "LIMIT 1;\n" +
          "END;";
  
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_balance created if it didn't exist");
      }
    });
    

    sql = "CREATE PROCEDURE IF NOT EXISTS `get_account_id`(\n" +
              "IN username VARCHAR(255),\n" +
              "IN account_name VARCHAR(255)\n" +
          ")\n" +
          "BEGIN\n" +
              "SELECT account_id FROM accounts a\n" +
              "JOIN users u ON u.user_id = a.user_id\n" +
              "WHERE u.username = username AND a.account_name = account_name\n" +
              "LIMIT 1;\n" +
          "END;";
  
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: procedure get_account_id created if it didn't exist");
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

        sql = "CALL insert_balance(1, 2000)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'balance' to user account");
        });
        
        sql = "CALL insert_balance(2, 2000)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'balance' to user account");
        });
    
        // sql = "CALL insert_user('jason', 'ruiz', 'passA', 'c9df8df29bea229f603a24f5674f061d763b188e41501949ef20a17af26659c7', '134397c672dd59da', @result)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'jason' to users");
        // });

        // sql = "CALL insert_user('derrick', 'Jeter', 'smellier@aol.com', 'leviosa', @result)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'jason' to users");
        // });

        // sql = "CALL insert_user('James', 'Bron', 'sme@aol.com', 'miami', @result)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'jason' to users");
        // });

        // sql = "CALL insert_account('checking', 1)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'checking' to accounts");
        // });

        // sql = "CALL insert_account('savings', 1)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'savings' to accounts");
        // });

        // sql = "CALL insert_account('checking', 2)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'checking' to accounts");
        // });

        // sql = "CALL insert_account('savings', 2)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'savings' to accounts");
        // });

        // sql = "CALL insert_account('checking', 3)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'checking' to accounts");
        // });

        // sql = "CALL insert_account('savings', 3)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'savings' to accounts");
        // });

        // sql = "CALL insert_transfer(10, 'Derrick', 'Netflix shared account', 1, 3)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'transfer' to transfers table");
        // });

        // sql = "CALL insert_transfer(10, 'Bron', 'Game tickets', 1, 5)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'transfer' to transfers table");
        // });

        // sql = "CALL insert_transfer(10, 'Cynthia', 'Netflix shared account', 1, 2)";
        // con.query(sql, function(err,rows){
        //   if (err) {
        //     console.log(err.message);
        //     throw err;
        //   }
        //   console.log("database.js: Added 'transfer' to transfers table");
        // });
        
        sql = "CALL insert_transaction(100, 'Target', 'Groceries', 1)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transaction' to transactions table");
        });

        sql = "CALL insert_transaction(100, 'Walmart', 'Electronics', 1)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transaction' to transactions table");
        });

        sql = "CALL insert_transaction(100, 'DICKs Sporting Goods', 'SPORTS', 1)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transaction' to transactions table");
        });

        sql = "CALL insert_transaction(100, 'Target', 'Groceries', 2)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transaction' to transactions table");
        });

        sql = "CALL insert_transaction(100, 'Walmart', 'Electronics', 2)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transaction' to transactions table");
        });

        sql = "CALL insert_transaction(100, 'DICKs Sporting Goods', 'SPORTS', 2)";
        con.query(sql, function(err,rows){
          if (err) {
            console.log(err.message);
            throw err;
          }
          console.log("database.js: Added 'transaction' to transactions table");
        });
    }

    module.exports = con;