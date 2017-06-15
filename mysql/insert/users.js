var mysql = require('mysql');

var con = mysql.createConnection(require('../mysql.config'));

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var sql = `
  INSERT INTO users (email, firstName, lastName) VALUES ('bla@bla.com', 'Urs', 'Schweizer')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    con.end();
  });
});
