const express = require('express');
const app = express();
const mysql = require('mysql2')
const cors = require('cors');
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if(err) return console.log("Error connecting to MySQL");
    console.log("Connected to MySQL as id: ", db.threadId)
})

//question 1
app.get('/patients', (req, res) => {
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

//question 2
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

//question 3
app.get('/patients/first-name/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve patients' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No patients found with that first name' });
      }
      res.json(results);
    });
  });
  
//question 4
app.get('/providers_specialty', (req, res) => {
    const specialty = req.query.specialty;
    const sql = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";

    db.query(sql, [specialty], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ results: results });
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    console.log('Sending message to the browser...')
    app.get('/', (req, res) => {
        res.send('The server started successfully!')
    })
})