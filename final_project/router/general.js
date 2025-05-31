const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  
   // Check if username and password are provided
   if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists. Please choose another." });
  }

  // Add new user to users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };
  
    try {
      const allBooks = await getBooks();
      res.status(200).send(JSON.stringify(allBooks, null, 2));
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };
  
    try {
      const book = await getBookByISBN(isbn);
      res.status(200).json(book);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });
  
  
  public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
  
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = Object.keys(books)
          .filter(isbn => books[isbn].author.toLowerCase() === author)
          .map(isbn => ({ isbn, ...books[isbn] }));
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found for the given author");
        }
      });
    };
  
    try {
      const booksByAuthor = await getBooksByAuthor(author);
      res.status(200).json(booksByAuthor);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
  
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = Object.keys(books)
          .filter(isbn => books[isbn].title.toLowerCase() === title)
          .map(isbn => ({ isbn, ...books[isbn] }));
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found for the given title");
        }
      });
    };
  
    try {
      const booksByTitle = await getBooksByTitle(title);
      res.status(200).json(booksByTitle);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });
  
  


  public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      const bookReview = books[isbn]["reviews"];
      
      // Check if reviews exist and are not empty
      if (!bookReview || Object.keys(bookReview).length === 0) {
        return res.status(200).json({ message: "No reviews present for this book" });
      }
      
      // Return the reviews object
      return res.status(200).json(bookReview);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
