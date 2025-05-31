const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
  };
  
const authenticatedUser = (username, password) => {
// Check if the username and password match any user in the users array
return users.some(user => user.username === username && user.password === password);
};
  
// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the user exists and credentials are correct
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
        { username: username },
        "fingerprint_customer",
        { expiresIn: "1h" }
    );

    // Save the token in the sessi
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Login successful!", token: accessToken });
});
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Get ISBN from URL params
    const isbn = req.params.isbn;

    // Get review text from request query
    const review = req.query.review;

    // Check if review text is provided
    if (!review) {
        return res.status(400).json({ message: "Review text is required as a query parameter." });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Get username from session (set during login)
    const username = req.session.authorization && req.session.authorization.username;
    if (!username) {
        return res.status(401).json({ message: "User not authenticated." });
    }

    // Add or modify the review
    if (!books[isbn]["reviews"]) {
        books[isbn]["reviews"] = {};
    }
    books[isbn]["reviews"][username] = review;

    return res.status(200).json({ message: "Review added/modified successfully!", reviews: books[isbn]["reviews"] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Get username from session (set during login)
    const username = req.session.authorization && req.session.authorization.username;
    if (!username) {
        return res.status(401).json({ message: "User not authenticated." });
    }
    books[isbn]["reviews"][username]

    return res.status(200).json({message:"Deleted successfully"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
