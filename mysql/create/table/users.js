var mysql = require('mysql');

var con = mysql.createConnection(require('../../mysql.config'));

con.connect(function(err) {
  if (err) throw err;
  var sql = `CREATE TABLE users (
    _id int NOT NULL AUTO_INCREMENT,
    email varchar(50) NOT NULL,
    firstName varchar(35) NOT NULL,
    lastName varchar(35) NOT NULL,
    createTime DATETIME NOT NULL,
    birthday DATE,
    gender TINYINT(1),
    passwordHash VARCHAR(255),
    hashingAlgo TINYINT(1),
    PRIMARY KEY (_id)
);`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
    con.end();
  });
});
