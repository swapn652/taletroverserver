const express = require('express')
const router  = express.Router()
const Book = require('../models/bookModel')
const Author = require('../models/authorModel')

router.use(express.json())

router.get('/yo', async(req, res) => {
    res.send("HEHE BOI")
})

//GET route for getting all the books
router.get('/books', async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve books' });
    }
  });

// GET route for getting a specific book by ID
app.get('/books/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the book' });
    }
  });
  

module.exports = router