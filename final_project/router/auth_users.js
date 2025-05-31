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
        "fingerprint_customer", // Secret key (should match the one used in your session)
        { expiresIn: "1h" }
    );

    // Save the token in the sessi
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Login successful!", token: accessToken });
});
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
