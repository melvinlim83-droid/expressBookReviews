const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = "access";

let users = [];

// Check if a user with the given username already exists
const isValid = (username)=>{
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
// Check if the user with the given username and password exists
const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, secretKey, { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Get the username
    const username = req.session.authorization['username'];

    // Get the current book review
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;
    
    if (reviews == null) {
        return res.status(404).json({ message: "Unable to find requested book" });
    }

    const newReview = req.query.review;
    reviews[username] = newReview;
    books[isbn].reviews = reviews;
    res.send(`${username} review for book ${isbn} updated`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Get the username and ISBN
    const username = req.session.authorization['username'];

    // Get the current book review
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;

    if (reviews == null) {
        return res.status(404).json({ message: "Unable to find requested review" });
    }
    
    delete reviews[username];
    res.send(`${username} review for book ${isbn} deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretKey = secretKey;
