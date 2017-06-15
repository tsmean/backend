var mysql = require('mysql');

var con = mysql.createConnection(require('../../mysql.config'));

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM users", function (err, result) {
    if (err) throw err;
    console.log(result);
    con.end();
  });
});
