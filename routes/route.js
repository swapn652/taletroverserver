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
      res.status(201).json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve books' });
    }
  });

// GET route for getting a specific book by ID
router.get('/books/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve the book' });
    }
  });
  

// POST route for adding a new book
router.post('/addBook', async (req, res) => {
    try {
      const { title, description, author } = req.body;
  
      const newBook = new Book({
        title,
        description,
        author,
      });
  
      const savedBook = await newBook.save();
  
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add the book' });
    }
  });
  

// edit a book's info
router.put('/editBook/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const book = await Book.findById(id);
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      book.title = title;
      book.description = description;

      await book.save();
  
      return res.status(200).json(book);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// DELETE a book
router.delete('/deleteBook/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBook = await Book.findByIdAndDelete(id);
  
      if (!deletedBook) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router