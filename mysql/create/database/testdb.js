var mysql = require('mysql');

var con = mysql.createConnection({
  host     : 'mysql.cn32tstd6wqk.eu-central-1.rds.amazonaws.com',
  user     : 'tsmean',
  password : 'jdj2198fjj1jjf9j1jwjd',
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE testdb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
    con.end();
  });
});
