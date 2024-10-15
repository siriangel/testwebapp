const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const config = {
    user: 'your_db_user',
    password: 'your_db_password',
    server: 'your_db_server',
    database: 'your_db_name'
};

app.post('/submit', async (req, res) => {
    try {
        await sql.connect(config);
        const { name } = req.body;
        await sql.query`INSERT INTO Names (Name) VALUES (${name})`;
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/names', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT Name FROM Names`;
        res.json(result.recordset.map(record => record.Name));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

const config = {
    connectionString: process.env.DB_CONNECTION_STRING
};

