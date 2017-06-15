var mysql = require('mysql');

var con = mysql.createConnection(require('../mysql.config'));

con.connect(function(err) {
  if (err) throw err;
  var sql = "DELETE FROM users WHERE _id = 1";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
    con.end();
  });
});
