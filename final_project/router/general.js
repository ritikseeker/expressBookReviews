const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from the request parameters
    const author = req.params.author;
  
    // Get all book keys (ISBNs)
    const bookKeys = Object.keys(books);
  
    // Filter books by author (case-insensitive)
    const matchingBooks = [];
    bookKeys.forEach(isbn => {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        // Add the book object along with its ISBN
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for the given author" });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the author from the request parameters
    const title = req.params.title;
  
    // Get all book keys (ISBNs)
    const bookKeys = Object.keys(books);
  
    // Filter books by author (case-insensitive)
    const matchingBooks = [];
    bookKeys.forEach(isbn => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        // Add the book object along with its ISBN
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for the given title" });
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
