var mysql = require('mysql');

const config = require('../../mysql.config');
delete config.database;
console.log(config);

var con = mysql.createConnection(config);

con.connect(function(err) {
  if (err) throw err;
  var sql = "DROP DATABASE mydb";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Database Dropped");
    con.end();
  });
});
