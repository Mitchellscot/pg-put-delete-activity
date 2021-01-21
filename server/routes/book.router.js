const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});


router.put('/status/:id',  (req, res) => {
  let book = req.body; // Book with updated content
  let id = req.params.id; // id of the book to update
  const query = `UPDATE "books" SET "status"='read' WHERE"id"=$1;`;
  console.log(`Updating book ${id} with `, book);
  pool.query(query, [id])
  .then((result) =>{
    res.sendStatus(200);
  }).catch((err) => {
    console.log(`Error making update: ${query}`, err);
    res.sendStatus(500);
  });
});

  //done
router.delete('/:id',  (req, res) => {
  let id = req.params.id;
  console.log('Delete route called with id of', id);
  const query = 'DELETE FROM "books" WHERE id=$1;';
  pool.query(query, [id]).
  then((result) => {
    res.sendStatus(204);
  }).catch((err) => {
  console.log(`error making the request: ${query}`);
  res.sendStatus(500);
  })
});

module.exports = router;
