const express = require('express')
const router  = express.Router()
const Book = require('../models/bookModel')
const Author = require('../models/authorModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
    const { title, description, story, authorId } = req.body;

    // Find the author with the provided authorId
    console.log()
    const author = await Author.findById(authorId);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const newBook = new Book({
      title,
      description,
      story,
      author: author._id, // Set the author field to the _id of the author
    });

    // Save the book to the database
    const savedBook = await newBook.save();

    // Update the author's books array with the newly created book's _id
    author.books.push(savedBook._id);
    await author.save();

    return res.status(201).json(savedBook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to add the book' });
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

const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key'

// POST new author
router.post('/addAuthor', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const author = new Author({
      email,
      password: hashedPassword,
    });

    await author.save();

    // Generate the JWT token with the email included in the payload
    const token = jwt.sign({ id: author._id, email: author.email }, secretKey);

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, author.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: author._id, email: author.email }, secretKey);
    const decodedToken = jwt.decode(token);
    const email2 = decodedToken?.email || null; 
    console.log(email2);

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/getUserData", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const { id, email } = decodedToken;

    // Assuming you have the User model, fetch the user data from the database
    // For example:
    // const user = await User.findById(id);
    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    return res.status(200).json({ id, email });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// GET all authors
router.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();

    return res.status(200).json(authors);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a particular author
router.get('/author/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

  

module.exports = router