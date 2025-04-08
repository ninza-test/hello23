const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));

// ❌ Vulnerable to SQL Injection
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testdb'
  });

  connection.connect();

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Server Error');
    } else if (results.length > 0) {
      res.send('Login successful!');
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  connection.end();
});

// ❌ Vulnerable to Cross-Site Scripting (XSS)
app.get('/search', (req, res) => {
  const term = req.query.q;
  res.send(`<h1>Results for: ${term}</h1>`);
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
