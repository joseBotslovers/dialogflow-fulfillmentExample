const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dialogflowdb"
});

//CREAR BBDD
/*con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  
    con.query("CREATE DATABASE dialogflowDB", function(err, result) {
        if (err) throw err;
        console.log("Base de datos creada");
    });

    

});
*/

//CREAR TABLA
//https://www.w3schools.com/nodejs/nodejs_mysql_create_table.asp
con.connect(function(err) {
    if (err) throw err;
    console.log("Table Connected!");
    /*Create a table named "customers":*/
    var sql = "CREATE TABLE tablechat (name VARCHAR(255), address VARCHAR(255))";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Tabla creada");
    });
});