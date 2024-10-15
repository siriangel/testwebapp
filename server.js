const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const config = {
    connectionString: process.env.DB_CONNECTION_STRING
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));
