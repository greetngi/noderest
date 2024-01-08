const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

const db = new sqlite3.Database('./Database/Books.sqlite');

app.use(express.json());

db.run('CREATE TABLE IF NOT EXISTS Books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, year INTEGER)');

app.get('/books', (req, res) => {
    db.all('SELECT * FROM Books', (err, rows) => {
        if (err) {
            res.status(500).send({ error: 'Database error' });
        } else {
            res.send(rows);
        }
    });
});

app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM Books WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else if (row) {
            res.send(row);
        } else {
            res.status(404).send({ error: 'Book not found' });
        }
    });
});

app.post('/books', (req, res) => {
    db.get('SELECT * FROM Books WHERE title = ?', req.body.title, (err, row) => {
        if (err){
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row);
            }
        }
    }
    );
}
);

app.post('/books', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO Books (title, author, year) VALUES (?, ?)', book.title, book.author, book.year, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(book);
        }
    });
}
);

app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE Books SET title = ?, author = ?, year = ? WHERE id = ?', book.title, book.author, book.year, req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(book);
        }
    });
}
);

app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM Books WHERE id = ?', req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({});
        }
    }
    );
}
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));