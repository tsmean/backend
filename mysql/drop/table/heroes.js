var mysql = require('mysql');

var con = mysql.createConnection(require('../../mysql.config'));

con.connect(function(err) {
  if (err) throw err;
  var sql = "DROP TABLE heroes";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table deleted");
    con.end();
  });
});
