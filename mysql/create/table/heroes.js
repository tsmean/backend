var mysql = require('mysql');

var con = mysql.createConnection(require('../../mysql.config'));

con.connect(function(err) {
  if (err) throw err;
  var sql = `CREATE TABLE heroes (
    _id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    PRIMARY KEY (_id)
);`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
    con.end();
  });
});
