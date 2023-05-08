const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


// default route
app.get('/', function (req, res) {
return res.send({ error: true, message: 'hello' })
});


// connection configurations
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'user'
});

// connect to database

dbConn.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });


// Retrieve all users 
app.get('/users', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'users list.' });
    });
});


// Retrieve user with id 
app.get('/user/:id', (req, res) => {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});

// Add a new user  
app.post('/user', (req, res) => {
    let user = req.body
    values = []
    values.push([user.name,user.email])
    
    if (!user) {
    return res.status(400).send({ error:true, message: 'Please provide user' });
    }
    dbConn.query('INSERT INTO users (name, email) VALUES ?',  [values], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});



//  Update user with id
app.put('/user', (req, res) => {
    let user = req.body
    console.log(user.id)
    if (!user.id || !user) {
    return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    let sql=`UPDATE users SET email = '${user.email}' WHERE id = ${user.id}`
    dbConn.query(sql,  (error, results) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});


//  Delete user
app.delete('/user', (req, res) => {
    let user_id = req.body.id;
    /*
    dbConn.query(`SELECT * FROM users WHERE id = ${id}`, function (error, results, fields) {
        if (error) throw error;
        });
    */
    if (!user_id) {
    return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', user_id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
    });
}); 


// set port
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })


