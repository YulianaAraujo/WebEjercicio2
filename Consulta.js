const http = require('http');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion',
  charset: 'utf8'
});

//html string that will be send to browser
var reo = '<html><head><title></title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head><body><div class= "container"><h1 class= "text-center">Consulta de datos Tabla Gestión</h1><br>{${table}}<p class= "font-weight-light">Integrantes: Marcela A. Bula Torres & Yuliana E. Bacca Araujo, 2021.</p></div></body></html>';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb) {
  pool.getConnection((err, con) => {
    if (err) throw err;

    con.query(sql, (err, res, cols) => {
      if (err) throw err;

      var table = ''; //to store html table

      //create html table with data from res.
      for (var i = 0; i < res.length; i++) {
        table += '<tr><td>' + (i + 1) + '</td><td>' + res[i].firstName + '</td><td>' + res[i].lastName + '</td><td>' + res[i].document + '</td><td>' + res[i].address + '</td><td>' + res[i].email + '</td><td>' + res[i].phone + '</td></tr>';
      }
      table = '<table class="table table-striped table-dark"><tr><th>Id</th><th>Nombre</th><th>Apellido</th><th>Documento</th><th>Dirección</th><th>E-mail</th><th>Teléfono</th></tr>' + table + '</table>';
     
      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}

let sql = 'SELECT firstName, lastName, document, address, phone, email FROM users WHERE id >0 ORDER BY lastName';

//create the server for browser access
const server = http.createServer((req, res) => {
  setResHtml(sql, resql => {
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(reo, 'utf-8');
    res.end();

  });

});

server.listen(8080, () => {
  console.log('Server running at //localhost:8080/');
});