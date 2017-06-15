var mysql      = require('mysql');

var con = mysql.createConnection(require('./mysql.config'));

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = `ALTER TABLE users
DROP COLUMN age;`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Column changed");
    con.end();
  });
});
